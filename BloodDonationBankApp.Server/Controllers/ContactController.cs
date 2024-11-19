using Microsoft.AspNetCore.Mvc;
using BloodBankApp.Models;
using BloodDonationBankApp.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace BloodBankApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContactController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateContact([FromBody] Contact contact)
        {
            if (contact == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            await _context.Contacts.AddAsync(contact);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Contact request submitted successfully!" });
        }

        [HttpGet]
        public async Task<IActionResult> GetContacts()
        {
            var contacts = await _context.Contacts.ToListAsync();
            return Ok(contacts);
        }
    }
}
