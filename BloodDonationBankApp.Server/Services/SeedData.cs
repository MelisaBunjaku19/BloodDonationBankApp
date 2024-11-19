using BloodDonationBankApp.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BloodDonationBankApp.Server.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

            // Ensure DB is created and migrations are applied
            await context.Database.MigrateAsync();

            // Seed roles and admin user
            await EnsureRolesAsync(roleManager);
            await EnsureAdminUserAsync(userManager);
        }

        private static async Task EnsureRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            string[] roleNames = { "USER", "ADMIN", "SuperADMIN" };

            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    var roleResult = await roleManager.CreateAsync(new IdentityRole(roleName));
                    if (!roleResult.Succeeded)
                    {
                        // Log or handle any failure to create roles here
                        throw new Exception($"Failed to create role: {roleName}");
                    }
                }
            }
        }

        private static async Task EnsureAdminUserAsync(UserManager<ApplicationUser> userManager)
        {
            var adminEmail = "admin@bloodbank.com";
            var adminPassword = "Admin@123";

            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true,
                    FullName = "Admin User"  // Ensure the FullName is set
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "ADMIN");
                    await userManager.AddToRoleAsync(adminUser, "SuperADMIN"); // Optional, to make the user a SuperAdmin as well
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        // Log the error (e.g., using a logging framework)
                        Console.WriteLine($"Error: {error.Description}");
                    }
                    throw new Exception("Admin user creation failed.");
                }
            }
            else
            {
                // If user exists, log that info (optional)
                Console.WriteLine($"Admin user {adminEmail} already exists.");
            }
        }
    }
}
