using BloodDonationBankApp.Server.Data;
using BloodDonationBankApp.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

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

        // GET: api/Blog
        [HttpGet]
        public async Task<IActionResult> GetBlogs()
        {
            var blogs = await _context.Blogs
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
            return Ok(blogs);
        }

        // GET: api/Blog/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBlogById(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return NotFound();
            return Ok(blog);
        }

        // POST: api/Blog
        [HttpPost]
        public async Task<IActionResult> CreateBlog(Blog blog)
        {
            blog.CreatedAt = DateTime.UtcNow;
            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBlogById), new { id = blog.Id }, blog);
        }

        // DELETE: api/Blog/5
        [HttpDelete("{id}")]
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
