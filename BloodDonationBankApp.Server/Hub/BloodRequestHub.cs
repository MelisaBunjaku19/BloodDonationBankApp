using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace BloodDonationBankApp.Server
{
    public class BloodRequestHub : Hub
    {
        private readonly ILogger<BloodRequestHub> _logger;

        public BloodRequestHub(ILogger<BloodRequestHub> logger)
        {
            _logger = logger;
        }

        // This method is called when a client connects
        public override Task OnConnectedAsync()
        {
            var connectionId = Context.ConnectionId;

            // Log the connection ID or perform any necessary actions when a client connects
            _logger.LogInformation($"Client connected. Connection ID: {connectionId}");

            return base.OnConnectedAsync();
        }

        // Method to notify all clients about a blood request
        public async Task NotifyRequest(string bloodType)
        {
            var connectionId = Context.ConnectionId;

            // Log the blood type and connection ID (optional)
            _logger.LogInformation($"Received blood request: {bloodType}. Connection ID: {connectionId}");

            // Send the blood request to all connected clients
            await Clients.All.SendAsync("ReceiveBloodRequest", bloodType);
        }

        // Optional: Handle disconnections (if needed)
        public override Task OnDisconnectedAsync(Exception exception)
        {
            var connectionId = Context.ConnectionId;
            _logger.LogInformation($"Client disconnected. Connection ID: {connectionId}");

            return base.OnDisconnectedAsync(exception);
        }
    }
}
