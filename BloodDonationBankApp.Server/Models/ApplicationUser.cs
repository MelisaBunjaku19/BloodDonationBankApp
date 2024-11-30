using Microsoft.AspNetCore.Identity;

namespace BloodDonationBankApp.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } // Optional field
       // public ICollection<Comment> Comments { get; set; }
      //  public ICollection<Like> Likes { get; set; }

    }
}
