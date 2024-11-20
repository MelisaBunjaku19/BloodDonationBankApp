namespace BloodDonationBankApp.Server.Models
{
    public class UserModel
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        // You may also add other profile-related properties
        public string Password { get; set; } // If updating password
    }
}
