using Microsoft.AspNetCore.Identity;

namespace BloodDonationBankApp.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } // Optional field
    }
}
