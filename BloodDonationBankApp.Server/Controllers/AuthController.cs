using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using BloodDonationBankApp.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BloodDonationBankApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationBankApp.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            // Validate input model
            if (model == null)
            {
                return BadRequest(new { Message = "Invalid registration data." });
            }

            // Log incoming model data for debugging
            Console.WriteLine($"Incoming Registration Data: FullName={model.FullName}, Email={model.Email}, Password={model.Password}, ConfirmPassword={model.ConfirmPassword}, Role={model.Role}");

            // Ensure all required fields are provided
            if (string.IsNullOrWhiteSpace(model.FullName) ||
                string.IsNullOrWhiteSpace(model.Email) ||
                string.IsNullOrWhiteSpace(model.Password) ||
                string.IsNullOrWhiteSpace(model.ConfirmPassword))
            {
                return BadRequest(new { Message = "All fields are required." });
            }

            // Check if passwords match
            if (model.Password != model.ConfirmPassword)
            {
                return BadRequest(new { Message = "Passwords do not match." });
            }

            // Validate email format (optional)
            if (!IsValidEmail(model.Email))
            {
                return BadRequest(new { Message = "Invalid email format." });
            }

            // Create the user object
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName
            };

            // Attempt to create the user
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                // Return all errors from the creation attempt
                return BadRequest(new
                {
                    Message = "Failed to create user.",
                    Errors = result.Errors.Select(e => e.Description).ToList()
                });
            }

            // Role assignment logic
            if (!string.IsNullOrWhiteSpace(model.Role))
            {
                // Ensure the role exists in the system before assigning
                var roleExists = await _roleManager.RoleExistsAsync(model.Role);
                if (!roleExists)
                {
                    // Remove the user to maintain data consistency if role is invalid
                    await _userManager.DeleteAsync(user);
                    return BadRequest(new { Message = $"Role '{model.Role}' does not exist." });
                }

                // Assign the provided role to the user
                var roleResult = await _userManager.AddToRoleAsync(user, model.Role);
                if (!roleResult.Succeeded)
                {
                    // Remove the user to maintain data consistency
                    await _userManager.DeleteAsync(user);
                    return BadRequest(new
                    {
                        Message = "Failed to assign role to the user.",
                        Errors = roleResult.Errors.Select(e => e.Description).ToList()
                    });
                }
            }
            else
            {
                // Assign a default role if none is provided
                const string defaultRole = "USER";
                var defaultRoleExists = await _roleManager.RoleExistsAsync(defaultRole);
                if (defaultRoleExists)
                {
                    await _userManager.AddToRoleAsync(user, defaultRole);
                }
            }

            return Ok(new { Message = "User created successfully." });
        }

        // Helper method for email validation
        private bool IsValidEmail(string email)
        {
            try
            {
                var mail = new System.Net.Mail.MailAddress(email);
                return mail.Address == email;
            }
            catch
            {
                return false;
            }
        }


        // Login API
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);
            if (!result.Succeeded)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var roles = await _userManager.GetRolesAsync(user);

            // Block login for unauthorized roles
            if (roles.Contains("BlockedUser"))
            {
                return Unauthorized(new { message = "Your account is currently blocked." });
            }

            var token = await GenerateJwtToken(user);  // Changed to await the method for async

            // Return JWT token in the response header instead of cookies
            return Ok(new { message = "Login successful", token });
        }

        // Logout API (clear token)
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // This assumes JWT token is sent in the 'Authorization' header
            return Ok(new { message = "Logged out successfully" });
        }

        // Admin-only endpoint
        [Authorize(Roles = "ADMIN")]
        [HttpGet("admin/dashboard")]
        public IActionResult GetAdminDashboard()
        {
            return Ok(new { message = "Welcome to the Admin Dashboard" });
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            // Get all users
            var users = await _userManager.Users.ToListAsync();

            // Initialize a list to hold user information with roles
            var userDetails = new List<object>();

            // Fetch roles for each user asynchronously
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                userDetails.Add(new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.UserName,
                    Roles = roles
                });
            }

            return Ok(userDetails);
        }

        // Delete user (admin only)
        [Authorize(Roles = "ADMIN")]
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "User not found" });

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(new { Message = "Failed to delete user" });

            return Ok(new { Message = "User deleted successfully" });
        }

        // Check if a role exists (utility method)
        private async Task<bool> RoleExists(string roleName)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            return role != null;
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("users/{id}")]
        public async Task<IActionResult> EditUser(string id, [FromBody] EditUserRequest updatedUser)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "User not found" });

            // Update the username if provided
            if (!string.IsNullOrEmpty(updatedUser.UserName))
            {
                user.UserName = updatedUser.UserName;
            }

            // Update roles if provided
            if (updatedUser.Roles != null && updatedUser.Roles.Any())
            {
                var currentRoles = await _userManager.GetRolesAsync(user);

                // Remove user from current roles
                await _userManager.RemoveFromRolesAsync(user, currentRoles);

                // Add new roles
                foreach (var role in updatedUser.Roles)
                {
                    var roleExist = await _roleManager.RoleExistsAsync(role);
                    if (roleExist)
                    {
                        await _userManager.AddToRoleAsync(user, role);
                    }
                }
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { Message = "Failed to update user" });
            }

            return Ok(new { Message = "User updated successfully" });
        }



        // Generate JWT Token
        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            // Ensure the user is not null
            if (user == null)
                throw new ArgumentNullException(nameof(user), "User cannot be null");

            // Get the user's roles asynchronously
            var roles = await _userManager.GetRolesAsync(user);

            // Create the claims for the JWT token
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            // Add the roles as claims
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            // Create the signing credentials using the security key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Generate the JWT token
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds);

            // Return the generated token as a string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
