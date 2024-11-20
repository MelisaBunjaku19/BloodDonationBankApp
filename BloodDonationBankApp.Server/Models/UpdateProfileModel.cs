namespace BloodDonationBankApp.Server.Models
{
    public class UpdateProfileModel
    {
        public string Email { get; set; }
        public string Password { get; set; } // new password
        public string CurrentPassword { get; set; } // old password for validation
    }
}
