using BloodDonationBankApp.Server.Data;
using BloodDonationBankApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Task = BloodDonationBankApp.Server.Models.Task;
using TaskStatus = BloodDonationBankApp.Server.Models.TaskStatus;

namespace BloodDonationBankApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "ADMIN")] // Ensure only admins can modify tasks
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Task>>> GetTasks()
        {
            try
            {
                var tasks = await _context.Tasks.ToListAsync();
                if (tasks == null || !tasks.Any())
                {
                    return NotFound("No tasks found.");
                }
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/tasks/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Task>> GetTask(int id)
        {
            try
            {
                var task = await _context.Tasks.FindAsync(id);
                if (task == null)
                {
                    return NotFound($"Task with ID {id} not found.");
                }
                return Ok(task);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<ActionResult<Task>> CreateTask([FromBody] Task newTask)
        {
            try
            {
                if (newTask == null)
                {
                    return BadRequest("Task data is required.");
                }

                // Validate the task (due date should not be in the past)
                if (newTask.DueDate < DateTime.Now)
                {
                    return BadRequest("The due date cannot be in the past.");
                }

                if (!Enum.IsDefined(typeof(TaskStatus), newTask.Status))
                {
                    return BadRequest("Invalid task status.");
                }

                // Optionally, validate the Task object if needed
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _context.Tasks.Add(newTask);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTask), new { id = newTask.Id }, newTask);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/tasks/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] Task updatedTask)
        {
            try
            {
                if (updatedTask == null)
                {
                    return BadRequest("Task data is required.");
                }

                var existingTask = await _context.Tasks.FindAsync(id);
                if (existingTask == null)
                {
                    return NotFound($"Task with ID {id} not found.");
                }

                // Validate the updated task (due date should not be in the past)
                if (updatedTask.DueDate < DateTime.Now)
                {
                    return BadRequest("The due date cannot be in the past.");
                }

                if (!Enum.IsDefined(typeof(TaskStatus), updatedTask.Status))
                {
                    return BadRequest("Invalid task status.");
                }

                // Update the task fields
                existingTask.Title = updatedTask.Title;
                existingTask.Description = updatedTask.Description;
                existingTask.DueDate = updatedTask.DueDate;
                existingTask.Status = updatedTask.Status;

                await _context.SaveChangesAsync();

                return NoContent(); // HTTP 204 No Content
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/tasks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            try
            {
                {
                    var task = await _context.Tasks.FindAsync(id);
                    if (task == null)
                    {
                        return NotFound($"Task with ID {id} not found.");
                    }

                    _context.Tasks.Remove(task);
                    await _context.SaveChangesAsync();

                    return NoContent(); // HTTP 204 No Content
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
