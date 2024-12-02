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
using System.Linq;
using System.Threading.Tasks;

namespace BloodDonationBankApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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

        // Registration Endpoint
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (model == null)
            {
                return BadRequest(new { Message = "Invalid registration data." });
            }

            if (string.IsNullOrWhiteSpace(model.FullName) || string.IsNullOrWhiteSpace(model.Email) ||
                string.IsNullOrWhiteSpace(model.Password) || string.IsNullOrWhiteSpace(model.ConfirmPassword))
            {
                return BadRequest(new { Message = "All fields are required." });
            }

            if (model.Password != model.ConfirmPassword)
            {
                return BadRequest(new { Message = "Passwords do not match." });
            }

            if (!IsValidEmail(model.Email))
            {
                return BadRequest(new { Message = "Invalid email format." });
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new { Message = "Failed to create user.", Errors = result.Errors.Select(e => e.Description).ToList() });
            }

            if (!string.IsNullOrWhiteSpace(model.Role))
            {
                var roleExists = await _roleManager.RoleExistsAsync(model.Role);
                if (!roleExists)
                {
                    await _userManager.DeleteAsync(user);
                    return BadRequest(new { Message = $"Role '{model.Role}' does not exist." });
                }

                var roleResult = await _userManager.AddToRoleAsync(user, model.Role);
                if (!roleResult.Succeeded)
                {
                    await _userManager.DeleteAsync(user);
                    return BadRequest(new { Message = "Failed to assign role to the user.", Errors = roleResult.Errors.Select(e => e.Description).ToList() });
                }
            }
            else
            {
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

        // Login Endpoint
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

            if (roles.Contains("BlockedUser"))
            {
                return Unauthorized(new { message = "Your account is currently blocked." });
            }

            var token = await GenerateJwtToken(user);

            return Ok(new { message = "Login successful", token });
        }

        // Generate JWT Token
        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user), "User cannot be null");

            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Admin Dashboard Endpoint (Only accessible by ADMIN)
        [Authorize(Roles = "ADMIN")]
        [HttpGet("admin/dashboard")]
        public IActionResult GetAdminDashboard()
        {
            return Ok(new { message = "Welcome to the Admin Dashboard" });
        }

        // Get Users (Admin-only)
        [Authorize(Roles = "ADMIN")]
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            var userDetails = new List<object>();
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

        // Delete User (Admin-only)
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

        // Update User Details (Admin-only)
        [Authorize(Roles = "ADMIN")]
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditUser(string id, [FromBody] EditUserRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Invalid request payload." });
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (!string.IsNullOrWhiteSpace(request.UserName)) user.UserName = request.UserName;
            if (!string.IsNullOrWhiteSpace(request.Email)) user.Email = request.Email;
            if (!string.IsNullOrWhiteSpace(request.FullName)) user.FullName = request.FullName;

            if (request.Roles != null && request.Roles.Any())
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!removeRolesResult.Succeeded)
                {
                    return BadRequest(new { message = "Failed to remove old roles." });
                }

                var addRolesResult = await _userManager.AddToRolesAsync(user, request.Roles);
                if (!addRolesResult.Succeeded)
                {
                    return BadRequest(new { message = "Failed to assign new roles." });
                }
            }

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                var updatedUser = await _userManager.FindByIdAsync(id);
                return Ok(new { message = "User updated successfully.", user = updatedUser });
            }
            else
            {
                return BadRequest(new { message = "Failed to update user." });
            }
        }

        // Update Password Endpoint
        /* [Authorize]
         [HttpPost("update-password")]
         public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordModel model)
         {
             if (model == null)
             {
                 return BadRequest(new { message = "Invalid password change request." });
             }

             var user = await _userManager.GetUserAsync(User);
             if (user == null)
             {
                 return Unauthorized(new { message = "User not found." });
             }

             var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
             if (!result.Succeeded)
             {
                 return BadRequest(new { message = "Password change failed.", errors = result.Errors.Select(e => e.Description) });
             }

             return Ok(new { message = "Password updated successfully." });
         }
     }
        */
    }

}