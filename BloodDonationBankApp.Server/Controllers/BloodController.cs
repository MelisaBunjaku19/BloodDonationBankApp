using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

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

        // List to store blood requests (replace with a database in production)
        private static List<BloodRequest> BloodRequests = new List<BloodRequest>();

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
        public IActionResult RequestBlood([FromBody] BloodRequest request)
        {
            if (!BloodStock.ContainsKey(request.BloodType))
            {
                return BadRequest(new { message = "Invalid blood type." });
            }

            // Check if there's enough stock
            if (BloodStock[request.BloodType] < request.Quantity)
            {
                // If not enough stock, save the request for admin visibility
                var alternative = BloodStock.FirstOrDefault(b => b.Value > 0).Key ?? "none available";
                BloodRequests.Add(request);
                return Ok(new
                {
                    message = "Not enough stock. Request has been sent to the admin.",
                    notifyAdmin = true,
                    suggestion = $"Consider restocking {alternative}.",
                });
            }

            // If there's enough stock, reduce the blood and save the request
            BloodStock[request.BloodType] -= request.Quantity;
            BloodRequests.Add(request);
            return Ok(new { message = "Blood request successful", stock = BloodStock });
        }

        [HttpGet("RequestedBlood")]
        public IActionResult GetBloodRequests()
        {
            return Ok(BloodRequests);
        }
    }

    public class BloodImportRequest
    {
        public string BloodType { get; set; }
        public int Quantity { get; set; }
    }

    public class BloodRequest
    {
        public string BloodType { get; set; }
        public string RequestedBy { get; set; } // Add information about the requester
        public int Quantity { get; set; } // Quantity now properly passed from the request
    }
}
