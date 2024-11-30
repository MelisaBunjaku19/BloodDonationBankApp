namespace BloodDonationBankApp.Server.Models
{
    public class Like
    {
      
            public int Id { get; set; }
            public int BlogId { get; set; }
            public string UserId { get; set; }
        public DateTime CreatedAt { get; set; }// Ensure the type matches your User model (e.g., string for Identity users)
        public Blog Blog { get; set; }
            public ApplicationUser User { get; set; }  // Use ApplicationUser if that's the name of your user class
        

    }

}
