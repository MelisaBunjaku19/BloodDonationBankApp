namespace BloodDonationBankApp.Server.Models
{
    public class Task
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public TaskStatus Status { get; set; }   // Default to Pending
    }

    public enum TaskStatus
    {
        Pending,
        InProgress,
        Completed,
        Canceled
    }


}
