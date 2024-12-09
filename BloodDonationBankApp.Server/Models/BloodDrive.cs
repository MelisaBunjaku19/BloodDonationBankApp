namespace BloodDonationBankApp.Server.Models
{
    public class BloodDrive
    {
        public int Id { get; set; }
        public string FacilityName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public DateTime DriveStartTime { get; set; }
        public DateTime DriveEndTime { get; set; }
        public bool IsAvailable { get; set; } // New field for availability
    }

}
