// ChatController.cs (Backend)
using Microsoft.AspNetCore.Mvc;

namespace BloodDonationApp.Servers.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        [HttpPost("sendMessage")]
        public IActionResult SendMessage([FromBody] ChatMessage message)
        {
            // Automated responses for blood donation related questions
            var response = string.Empty;

            if (message.Message.ToLower().Contains("how do i donate blood"))
            {
                response = "To donate blood, visit your nearest blood donation center or participate in our upcoming blood donation camp. Make sure you're healthy and eligible.";
            }
            else if (message.Message.ToLower().Contains("who can donate blood"))
            {
                response = "Most healthy people aged between 18-65 can donate blood. However, some conditions like certain illnesses and medications may make you ineligible.";
            }
            else if (message.Message.ToLower().Contains("why should i donate blood"))
            {
                response = "Blood donation is crucial to save lives. It helps patients undergoing surgeries, cancer treatments, and those in emergency situations.";
            }
            else if (message.Message.ToLower().Contains("how often can i donate blood"))
            {
                response = "You can donate whole blood every 56 days, while plasma and platelets can be donated more frequently, based on medical advice.";
            }
            else
            {
                response = "Thank you for your question! Blood donation helps save lives. For more details, feel free to ask more questions!";
            }

            return Ok(new { reply = response });
        }
    }

    public class ChatMessage
    {
        public string Message { get; set; }
    }
}
