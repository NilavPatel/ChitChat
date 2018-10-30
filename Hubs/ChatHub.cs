using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ChitChat.Hubs
{
    public class ChatHub : Hub
    {
        static IList<string> activeUsers = new List<string>();
        
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendTyping(string sender)
        {
            // Broadcast the typing notification to all clients except the sender
            await Clients.Others.SendAsync("typing", sender);
        }

        public async Task OnConnected(string user)
        {
            activeUsers.Add(user);
            await Clients.Others.SendAsync("OnConnected", user);
        }

        public async Task OnDisconnected(string user)
        {
            activeUsers.Remove(user);
            await Clients.Others.SendAsync("OnDisconnected", user);
        }

        public IList<string> GetActiveUserList()
        {
            return activeUsers;
        }
    }
}