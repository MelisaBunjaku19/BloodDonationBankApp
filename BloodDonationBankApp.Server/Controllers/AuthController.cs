using Azure;
using BloodDonationBankApp.Models;
using BloodDonationBankApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    // Register API
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        // Validate password
        if (model.Password != model.ConfirmPassword)
            return BadRequest("Passwords do not match");

        if (model.Password.Length < 6) // Example: Minimum length check for security
            return BadRequest("Password must be at least 6 characters long");

        // Validate Role
        if (!await RoleExists(model.Role))
            return BadRequest($"Role '{model.Role}' is not valid.");

        if (model.Role == "Admin")
        {
            // Only allow admins to create admins (replace this with your logic)
            var requestingUser = await _userManager.GetUserAsync(User);
            if (requestingUser == null || !await _userManager.IsInRoleAsync(requestingUser, "Admin"))
            {
                return Unauthorized(new { message = "Only admins can create other admins." });
            }
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
            return BadRequest(result.Errors);
        }

        // Assign role to user
        var roleResult = await _userManager.AddToRoleAsync(user, model.Role);
        if (!roleResult.Succeeded)
        {
            return BadRequest(roleResult.Errors);
        }

        return Ok(new { Message = "User created successfully" });
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

        // Example: Block login for unauthorized roles if needed
        if (roles.Contains("BlockedUser"))
        {
            return Unauthorized(new { message = "Your account is currently blocked." });
        }

        var token = GenerateJwtToken(user);

        // Set JWT token as HttpOnly cookie (ensure HTTPS in production)
        Response.Cookies.Append("jwt", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Enable in production
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        });

        return Ok(new { message = "Login successful", token = token });
    }

    // Logout API (clear cookie)
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // Delete the JWT cookie
        Response.Cookies.Delete("jwt");
        return Ok(new { message = "Logged out successfully" });
    }

    // Admin-only endpoint example
    [Authorize(Roles = "Admin")]
    [HttpGet("admin/dashboard")]
    public IActionResult GetAdminDashboard()
    {
        return Ok(new { message = "Welcome to the Admin Dashboard" });
    }

    private async Task<bool> RoleExists(string roleName)
    {
        var roles = await _userManager.GetRolesAsync(new ApplicationUser());
        return roles.Contains(roleName);
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var roles = _userManager.GetRolesAsync(user).Result;

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName)
        };

        // Add roles as claims
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
}
