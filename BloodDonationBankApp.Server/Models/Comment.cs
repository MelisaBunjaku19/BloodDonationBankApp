namespace BloodDonationBankApp.Server.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int BlogId { get; set; }
        public string UserId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public Blog Blog { get; set; }
        public ApplicationUser User { get; set; }
    }

}
