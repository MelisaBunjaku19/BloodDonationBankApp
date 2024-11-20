using BloodDonationBankApp.Server.Models;
using BloodDonationBankApp.Server.Data;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Logging;

namespace BloodDonationBankApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriberController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<SubscriberController> _logger;

        // Constructor
        public SubscriberController(ApplicationDbContext context, IConfiguration configuration, ILogger<SubscriberController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }
        [HttpPost]
        public IActionResult Subscribe([FromBody] SubscriberRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email) || !new EmailAddressAttribute().IsValid(request.Email))
                {
                    _logger.LogWarning("Invalid email: {Email}", request.Email);
                    return BadRequest("Invalid email address.");
                }

                // Case insensitive check for existing email
                if (_context.Subscribers.Any(s => s.Email.ToLower() == request.Email.ToLower()))
                {
                    _logger.LogWarning("Duplicate email: {Email}", request.Email);
                    return BadRequest("This email is already subscribed.");
                }

                // Save the subscriber to the database
                var subscriber = new Subscriber
                {
                    Email = request.Email,
                    SubscribedOn = DateTime.UtcNow
                };

                _context.Subscribers.Add(subscriber);
                _context.SaveChanges();

                SendEmailNotification(request.Email);

                return Ok(new { message = "Subscription successful. Confirmation email sent." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during subscription for email: {Email}", request.Email);
                return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
            }
        }
        private void SendEmailNotification(string email)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Blood Donation Bank", "melisabunjaku1428@gmail.com"));
                message.To.Add(new MailboxAddress("", email));
                message.Subject = "Welcome to Blood Donation Bank!";

                var bodyBuilder = new BodyBuilder
                {
                    // Define both text and HTML bodies to ensure compatibility with all email clients.
                    TextBody = "Thank you for subscribing to the Blood Donation Bank. We appreciate your interest!",
                    HtmlBody = @"
            <html>
                <body style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;'>
                    <div style='background-color: #e74c3c; padding: 20px; text-align: center; color: #fff;'>
                        <img src='cid:logo' alt='Blood Donation Bank' style='width: 150px; margin-bottom: 10px;' />
                        <h1 style='margin: 0; font-size: 24px;'>Thank You for Subscribing!</h1>
                    </div>
                    <div style='padding: 20px; text-align: left;'>
                        <p style='font-size: 16px; line-height: 1.5;'>Dear Subscriber,</p>
                        <p style='font-size: 16px; line-height: 1.5;'>We are thrilled to have you on board! Your subscription to the Blood Donation Bank means a lot to us, as we work together to save lives and make a difference.</p>
                        <p style='font-size: 16px; line-height: 1.5;'>You will now receive updates about upcoming donation drives, inspiring stories, and ways you can contribute to our life-saving mission.</p>
                        <p style='font-size: 16px; line-height: 1.5;'>Thank you for your support and commitment to saving lives.</p>
                        <p style='font-size: 16px; line-height: 1.5; text-align: center;'><strong>Every drop counts!</strong></p>
                    </div>
                    <div style='background-color: #f7f7f7; padding: 10px 20px; text-align: center;'>
                        <p style='font-size: 14px; margin: 0;'>© 2024 Blood Donation Bank. All rights reserved.</p>
                    </div>
                </body>
            </html>"
                };

                // Attach the logo as a LinkedResource
                var logoPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "assets", "images", "logo2.png");
                var logoImage = bodyBuilder.LinkedResources.Add(logoPath);
                logoImage.ContentId = "logo";  // This is the ContentId referenced in the HTML img tag
                logoImage.ContentType.MediaType = "image/png";
                logoImage.ContentType.Name = "logo2.png";

                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    client.Connect("smtp.gmail.com", 587, false);
                    client.Authenticate("melisabunjaku1428@gmail.com", "qybc nrlz qguo xkix");
                    client.Send(message);
                    client.Disconnect(true);
                }

                _logger.LogInformation("Confirmation email sent to {Email}", email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending confirmation email to {Email}", email);
            }
        }



        // Request Model
        public class SubscriberRequest
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }
        }
    }
}
