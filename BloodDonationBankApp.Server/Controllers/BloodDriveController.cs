using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BloodDonationBankApp.Server.Data;
using BloodDonationBankApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Threading.Tasks;

namespace BloodDonationBankApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BloodDriveController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BloodDriveController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/BloodDrive/search (Public endpoint for users to search blood drives)
        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchDrives(string postalCode)
        {
            if (string.IsNullOrWhiteSpace(postalCode))
            {
                return BadRequest("Postal code is required.");
            }

            var bloodDrives = await _context.BloodDrives
                .Where(d => d.PostalCode == postalCode)
                .Select(d => new
                {
                    d.Id,
                    d.FacilityName,
                    d.Address,
                    d.City,
                    d.PostalCode,
                    d.Latitude,
                    d.Longitude,
                    d.DriveStartTime,
                    d.DriveEndTime,
                    IsAvailable = d.DriveEndTime > DateTime.UtcNow
                })
                .ToListAsync();

            if (!bloodDrives.Any())
            {
                return NotFound("No blood drives found for the given postal code.");
            }

            return Ok(bloodDrives);
        }

        // GET: api/BloodDrive (Admin-only endpoint to view all drives)
        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetAllDrives()
        {
            var bloodDrives = await _context.BloodDrives
                .Select(d => new
                {
                    d.Id,
                    d.FacilityName,
                    d.Address,
                    d.City,
                    d.PostalCode,
                    d.Latitude,
                    d.Longitude,
                    d.DriveStartTime,
                    d.DriveEndTime,
                    IsAvailable = d.DriveEndTime > DateTime.UtcNow // Ensuring availability logic
                })
                .ToListAsync();

            if (!bloodDrives.Any())
            {
                return NotFound("No blood drives available.");
            }

            return Ok(bloodDrives);
        }
        // PATCH: api/BloodDrive/{id}/toggle-availability (Admin-only endpoint to toggle availability)
        [HttpPatch("{id}/toggle-availability")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> ToggleAvailability(int id)
        {
            var bloodDrive = await _context.BloodDrives.FindAsync(id);
            if (bloodDrive == null)
            {
                return NotFound("Blood drive not found.");
            }

            // Toggle the availability
            bloodDrive.IsAvailable = !bloodDrive.IsAvailable; // Directly toggle the availability status

            if (bloodDrive.IsAvailable)
            {
                bloodDrive.DriveEndTime = DateTime.UtcNow.AddHours(1); // Set the end time to 1 hour ahead if available
            }
            else
            {
                bloodDrive.DriveEndTime = DateTime.UtcNow.AddMinutes(-1); // Set the end time to a past time if unavailable
            }

            _context.Entry(bloodDrive).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                bloodDrive.Id,
                bloodDrive.FacilityName,
                bloodDrive.Address,
                bloodDrive.City,
                bloodDrive.PostalCode,
                bloodDrive.Latitude,
                bloodDrive.Longitude,
                bloodDrive.DriveStartTime,
                bloodDrive.DriveEndTime,
                IsAvailable = bloodDrive.IsAvailable
            });
        }
    }
}

