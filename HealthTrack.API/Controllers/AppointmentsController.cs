using HealthTrack.API.Data;
using HealthTrack.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AppointmentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? department,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.Appointments
            .Include(a => a.Patient)
            .AsQueryable();

        if (!string.IsNullOrEmpty(department))
            query = query.Where(a => a.Department == department);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(a => a.Status == status);

        var total = await query.CountAsync();
        var appointments = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { total, page, pageSize, data = appointments });
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var today = DateTime.Today;
        var summary = new
        {
            TotalAppointments = await _context.Appointments.CountAsync(),
            TodayAppointments = await _context.Appointments
                .CountAsync(a => a.AppointmentDate.Date == today),
            Completed = await _context.Appointments
                .CountAsync(a => a.Status == "Completed"),
            Cancelled = await _context.Appointments
                .CountAsync(a => a.Status == "Cancelled"),
            AvgWaitTime = await _context.Appointments
                .AverageAsync(a => a.WaitTimeMinutes)
        };
        return Ok(summary);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Appointment appointment)
    {
        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = appointment.Id }, appointment);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Appointment appointment)
    {
        if (id != appointment.Id) return BadRequest();
        _context.Entry(appointment).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}