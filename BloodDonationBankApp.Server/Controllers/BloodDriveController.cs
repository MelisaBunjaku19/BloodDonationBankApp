using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BloodDonationBankApp.Server.Models;
using BloodDonationBankApp.Server.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BloodDonationBankApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BloodDriveController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BloodDriveController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<object>>> SearchDrives(string postalCode)
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
                    d.Latitude,  // Include Latitude
                    d.Longitude, // Include Longitude
                    d.DriveStartTime, // Send raw DateTime
                    d.DriveEndTime,   // Send raw DateTime
                    isAvailable = d.DriveEndTime > DateTime.UtcNow
                })
                .ToListAsync();

            if (!bloodDrives.Any())
            {
                return NotFound("No blood drives found for the given postal code.");
            }

            return Ok(bloodDrives);
        }



        // GET: api/BloodDrive
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            // Get all blood drives (optional, depending on your needs)
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
                    isAvailable = d.DriveEndTime > DateTime.UtcNow
                })
                .ToListAsync();

            // Return blood drives or a message if none found
            if (!bloodDrives.Any())
            {
                return NotFound("No blood drives available.");
            }

            return Ok(bloodDrives);
        }

    }

}
