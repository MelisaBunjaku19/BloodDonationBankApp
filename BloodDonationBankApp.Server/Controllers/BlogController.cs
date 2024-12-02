using BloodDonationBankApp.Server.Data;
using BloodDonationBankApp.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace BloodDonationBankApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BlogController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Blog (Public endpoint for all users to view blogs)
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetBlogs()
        {
            // Fetching blogs with basic details like title, summary, and created date
            var blogs = await _context.Blogs
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Summary, // Assuming you have a summary field
                    b.CreatedAt,
                    b.ImageUrl  // Prepending the image path
                })
                .ToListAsync();
            return Ok(blogs);
        }

        // GET: api/Blog/5 (Public endpoint to view individual blog details)
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBlogById(int id)
        {
            // Fetching the full blog details for a single blog, including content
            var blog = await _context.Blogs
                .Where(b => b.Id == id)
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Content, // Full content for details view
                    b.Summary,
                    b.CreatedAt,
                    ImageUrl = b.ImageUrl // Prepending the image path
                })
                .FirstOrDefaultAsync();

            if (blog == null)
                return NotFound();

            return Ok(blog);
        }

        // POST: api/Blog (Admin-only endpoint to create a blog)
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CreateBlog(Blog blog)
        {
            blog.CreatedAt = DateTime.UtcNow;
            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBlogById), new { id = blog.Id }, blog);
        }

        // DELETE: api/Blog/5 (Admin-only endpoint to delete a blog)
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return NotFound();

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
            return NoContent();
        }
       



    }

}
