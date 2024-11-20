using BloodDonationBankApp.Models;
using BloodDonationBankApp.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;
using System.Security.Claims;

namespace BloodDonationBankApp.Server.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public UserController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // Get user profile
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var user = await _userManager.GetUserAsync(User);  // Get the current logged-in user

            if (user == null)
            {
                return Unauthorized(new { message = "User not found" });
            }

            // Return user profile details
            return Ok(new UserModel
            {
              
                FullName = user.FullName,
                Email = user.Email,
            });
        }

        // Change user password
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found" });
            }

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (result.Succeeded)
            {
                return Ok(new { message = "Password changed successfully" });
            }

            return BadRequest(result.Errors);
        }

        // Delete user account
        [HttpDelete("delete-account")]
        [Authorize]
        public async Task<IActionResult> DeleteAccount()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found" });
            }

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return Ok(new { message = "Account deleted successfully" });
            }

            return BadRequest(result.Errors);
        }

        // Update user profile
        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileModel model)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found" });
            }

            // Update user email if provided
            if (!string.IsNullOrEmpty(model.Email) && model.Email != user.Email)
            {
                var emailChangeResult = await _userManager.SetEmailAsync(user, model.Email);
                if (!emailChangeResult.Succeeded)
                {
                    return BadRequest(new { message = "Failed to update email" });
                }
            }

            // Update password if provided
            if (!string.IsNullOrEmpty(model.Password))
            {
                var changePasswordResult = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.Password);
                if (!changePasswordResult.Succeeded)
                {
                    return BadRequest(new { message = "Failed to update password" });
                }
            }

            return Ok(new { message = "Profile updated successfully" });
        }
    }
}
