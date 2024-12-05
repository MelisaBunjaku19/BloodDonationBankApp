using Microsoft.AspNetCore.SignalR;

public class BloodStockHub : Hub
{
    public async Task SendBloodStockUpdate(string bloodType, int count)
    {
        await Clients.All.SendAsync("ReceiveBloodStockUpdate", bloodType, count);
    }
}
