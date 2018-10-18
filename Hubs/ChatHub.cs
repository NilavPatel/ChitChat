using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ChitChat.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendTyping(string sender)
        {
            // Broadcast the typing notification to all clients except the sender
            await Clients.Others.SendAsync("typing", sender);
        }
        
    }
}