namespace BloodDonationBankApp.Server.Models
{
    public class EditUserRequest
    {
        public string UserName { get; set; }
        public string Email { get; set; }  // Add this property
        public string FullName { get; set; }  // Add this property
        public List<string> Roles { get; set; }
    }

}
