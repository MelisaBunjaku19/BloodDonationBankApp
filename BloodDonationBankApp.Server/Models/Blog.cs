namespace BloodDonationBankApp.Server.Models
{
    public class Blog
    {
       
        public int Id { get; set; } // Primary Key
        public string Title { get; set; } // Blog Title
        public string Summary { get; set; } // Short Summary
        public string Content { get; set; } // Full Content
        public string ImageUrl { get; set; } // Image URL
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Timestamp
    }
}
