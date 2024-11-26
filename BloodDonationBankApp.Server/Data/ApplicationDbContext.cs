using BloodBankApp.Models;
using BloodDonationBankApp.Server.Models;

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

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

    }
}
