using System;
using System.ComponentModel.DataAnnotations;

namespace BloodDonationBankApp.Server.Models
{
    public class DonationRequest
    {
        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Phone]
        public string PhoneNumber { get; set; }

        [Required]
        public string BloodType { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Weight must be greater than 0")]
        public int Weight { get; set; }

        [Required]
        [Range(1, 12, ErrorMessage = "Preferred hour must be between 1 and 12")]
        public int PreferredHour { get; set; }

        [Required]
        [Range(0, 59, ErrorMessage = "Preferred minute must be between 0 and 59")]
        public int PreferredMinute { get; set; }

        [Required]
        [RegularExpression("^(AM|PM)$", ErrorMessage = "Preferred period must be 'AM' or 'PM'")]
        public string PreferredPeriod { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        [DataType(DataType.Date)]
        public DateTime? LastDonationDate { get; set; }

        public string MedicalConditions { get; set; }

        [Required]
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;
    }
}
