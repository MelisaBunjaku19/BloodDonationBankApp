using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using BloodDonationBankApp.Server.Data;  // Include the correct namespace for ApplicationDbContext
using BloodDonationBankApp.Server.Models;  // Ensure this contains your models

namespace BloodDonationBankApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BloodController : ControllerBase
    {
        private static Dictionary<string, int> BloodStock = new Dictionary<string, int>
        {
            { "A+", 5 },
            { "A-", 3 },
            { "B+", 2 },
            { "B-", 0 },
            { "AB+", 1 },
            { "O+", 4 },
            { "O-", 0 }
        };

        private readonly ApplicationDbContext _context;

        public BloodController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Import blood and update stock
        [HttpPost("BloodImport")]
        public IActionResult ImportBlood([FromBody] BloodImportRequest request)
        {
            if (!BloodStock.ContainsKey(request.BloodType))
            {
                return BadRequest(new { message = "Invalid blood type." });
            }

            BloodStock[request.BloodType] += request.Quantity;
            return Ok(new { message = "Blood imported successfully", stock = BloodStock });
        }

        [HttpPost("RequestBlood")]
        public async Task<IActionResult> RequestBlood([FromBody] BloodRequest request)
        {
            if (!BloodStock.ContainsKey(request.BloodType))
            {
                return BadRequest(new { message = "Invalid blood type." });
            }

            // Ensure the quantity is greater than zero
            if (request.Quantity <= 0)
            {
                return BadRequest(new { message = "Quantity must be greater than zero." });
            }

            // Check if there's enough stock
            if (BloodStock[request.BloodType] < request.Quantity)
            {
                var alternative = BloodStock.FirstOrDefault(b => b.Value > 0).Key ?? "none available";

                await _context.BloodRequests.AddAsync(request);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Request has been sent to the admin.",
                    notifyAdmin = true,
                    suggestion = $"Consider restocking {alternative}.",
                });
            }

            // If enough stock, reduce the blood and save the request
            BloodStock[request.BloodType] -= request.Quantity;

            await _context.BloodRequests.AddAsync(request);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Blood request successful", stock = BloodStock });
        }

        // View all blood requests
        [HttpGet("RequestedBlood")]
        public async Task<IActionResult> GetBloodRequests()
        {
            var bloodRequests = await _context.BloodRequests.ToListAsync();

            if (bloodRequests.Count == 0)
            {
                return Ok(new { message = "No blood requests at the moment." });
            }

            return Ok(bloodRequests);
        }

        // Cancel a blood request
        [HttpDelete("RequestedBlood/{id}")]
        public async Task<IActionResult> CancelBloodRequest(int id)
        {
            // Retrieve the blood request to cancel
            var request = await _context.BloodRequests.FindAsync(id);

            if (request == null)
            {
                return NotFound(new { message = "Blood request not found." });
            }

            // Restore the blood stock
            if (BloodStock.ContainsKey(request.BloodType))
            {
                BloodStock[request.BloodType] += request.Quantity;
            }

            // Delete the request from the database
            _context.BloodRequests.Remove(request);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Blood request has been canceled", stock = BloodStock });
        }
    }

    // Request model for importing blood
    public class BloodImportRequest
    {
        public string BloodType { get; set; }
        public int Quantity { get; set; }
    }

    // Request model for blood requests
    public class BloodRequest
    {
        public int Id { get; set; }  // Primary key
        public string BloodType { get; set; }
        public string RequestedBy { get; set; }
        public int Quantity { get; set; }
        public DateTime RequestedAt { get; set; } = DateTime.Now;  // Timestamp for when the request was made
    }
}
