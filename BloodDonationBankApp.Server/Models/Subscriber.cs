using System.ComponentModel.DataAnnotations;

namespace BloodDonationBankApp.Server.Models
{
    public class Subscriber
    {
        public int Id { get; set; } // Primary Key

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public DateTime SubscribedOn { get; set; }
    }
}
