using BloodBankApp.Models;
using BloodDonationBankApp.Server.Controllers;
using BloodDonationBankApp.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Task = BloodDonationBankApp.Server.Models.Task;

namespace BloodDonationBankApp.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Subscriber> Subscribers { get; set; }
        public DbSet<Blog> Blogs { get; set; }
   
        public DbSet<DonationRequest> DonationRequests { get; set; }

        public DbSet<BloodDrive> BloodDrives { get; set; }
        public DbSet<BloodRequest> BloodRequests { get; set; }
        public DbSet<Task> Tasks { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            /* Configure Like entity relationships
            modelBuilder.Entity<Like>()
                .HasOne(l => l.Blog)
                .WithMany(b => b.Likes)
                .HasForeignKey(l => l.BlogId)
                .OnDelete(DeleteBehavior.Cascade); // Ensure likes are deleted when a blog is deleted

            modelBuilder.Entity<Like>()
                .HasOne(l => l.User)
                .WithMany(u => u.Likes)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent deletion of users affecting likes

            // Configure Comment entity relationships
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Blog)
                .WithMany(b => b.Comments)
                .HasForeignKey(c => c.BlogId)
                .OnDelete(DeleteBehavior.Cascade); // Ensure comments are deleted when a blog is deleted

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent deletion of users affecting comments
      */  }
    }
}
