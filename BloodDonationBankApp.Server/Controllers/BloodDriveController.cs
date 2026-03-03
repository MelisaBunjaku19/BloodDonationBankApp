using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BloodDonationBankApp.Server.Data;
using BloodDonationBankApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Threading.Tasks;
using System;

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


        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchDrives(string postalCode)
        {
            if (string.IsNullOrWhiteSpace(postalCode))
                return BadRequest("Postal code is required.");

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
                    d.IsAvailable
                })
                .ToListAsync();

            if (!bloodDrives.Any())
                return NotFound("No blood drives found for the given postal code.");

            return Ok(bloodDrives);
        }


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
                    d.IsAvailable
                })
                .ToListAsync();

            if (!bloodDrives.Any())
                return NotFound("No blood drives available.");

            return Ok(bloodDrives);
        }


        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CreateBloodDrive([FromBody] BloodDrive drive)
        {
            if (drive == null)
                return BadRequest("Invalid data.");

            // Basic validation
            if (string.IsNullOrWhiteSpace(drive.FacilityName) ||
                string.IsNullOrWhiteSpace(drive.City) ||
                string.IsNullOrWhiteSpace(drive.PostalCode) ||
                drive.DriveStartTime == default ||
                drive.DriveEndTime == default)
            {
                return BadRequest("Missing required fields.");
            }

            // Save to database
            _context.BloodDrives.Add(drive);
            await _context.SaveChangesAsync();

            return Ok(drive);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateBloodDrive(int id, [FromBody] BloodDrive drive)
        {
            if (drive == null)
                return BadRequest("Invalid data.");

            var existing = await _context.BloodDrives.FindAsync(id);
            if (existing == null)
                return NotFound("Blood drive not found.");

            // Update fields
            existing.FacilityName = drive.FacilityName;
            existing.Address = drive.Address;
            existing.City = drive.City;
            existing.PostalCode = drive.PostalCode;
            existing.Latitude = drive.Latitude;
            existing.Longitude = drive.Longitude;
            existing.DriveStartTime = drive.DriveStartTime;
            existing.DriveEndTime = drive.DriveEndTime;
            existing.IsAvailable = drive.IsAvailable;

            _context.Entry(existing).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(existing);
        }

   
        [HttpPatch("{id}/toggle-availability")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> ToggleAvailability(int id)
        {
            var drive = await _context.BloodDrives.FindAsync(id);
            if (drive == null)
                return NotFound("Blood drive not found.");

            // Simply flip the admin-controlled flag
            drive.IsAvailable = !drive.IsAvailable;

            _context.Entry(drive).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(drive);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteBloodDrive(int id)
        {
            var drive = await _context.BloodDrives.FindAsync(id);
            if (drive == null)
                return NotFound("Blood drive not found.");

            _context.BloodDrives.Remove(drive);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}