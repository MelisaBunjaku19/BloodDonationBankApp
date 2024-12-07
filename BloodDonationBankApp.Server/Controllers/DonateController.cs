using Microsoft.AspNetCore.Mvc;
using BloodDonationBankApp.Server.Models;
using BloodDonationBankApp.Server.Data;
using Microsoft.AspNetCore.Authorization;

namespace BloodDonationBankApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonationRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DonationRequestController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult SubmitDonationRequest([FromBody] DonationRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.DonationRequests.Add(request);
                _context.SaveChanges();
                return Ok(new { message = "Donation request submitted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while submitting the request", error = ex.Message });
            }
        }

        // New GET endpoint to fetch all donations for admins
        [HttpGet]
        [Authorize(Roles = "ADMIN")]  // Ensures only admin can access
        public IActionResult GetAllDonationRequests()
        {
            try
            {
                var donations = _context.DonationRequests.ToList();
                return Ok(donations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the donation requests", error = ex.Message });
            }
        }

        // DELETE endpoint to delete a donation request by ID
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]  // Only admins can delete donation requests
        public IActionResult DeleteDonationRequest(int id)
        {
            try
            {
                var donation = _context.DonationRequests.Find(id);
                if (donation == null)
                {
                    return NotFound(new { message = "Donation request not found" });
                }

                _context.DonationRequests.Remove(donation);
                _context.SaveChanges();
                return Ok(new { message = "Donation request deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the donation request", error = ex.Message });
            }
        }
    }
}

