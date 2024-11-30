namespace BloodDonationBankApp.Server.Models
{
    public class EditUserRequest
    {
        public string UserName { get; set; }
        public List<string> Roles { get; set; }
    }

}
