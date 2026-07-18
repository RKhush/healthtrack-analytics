using HealthTrack.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class KpiController : ControllerBase
{
    private readonly AppDbContext _context;

    public KpiController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var totalPatients = await _context.Patients.CountAsync();
        var totalAppointments = await _context.Appointments.CountAsync();
        var avgWaitTime = await _context.Appointments.AverageAsync(a => a.WaitTimeMinutes);
        var today = DateTime.Today;
        var todayAppointments = await _context.Appointments
            .CountAsync(a => a.AppointmentDate.Date == today);

        return Ok(new
        {
            TotalPatients = totalPatients,
            TotalAppointments = totalAppointments,
            AvgWaitTimeMinutes = Math.Round(avgWaitTime, 1),
            TodayAppointments = todayAppointments
        });
    }

    [HttpGet("by-department")]
    public async Task<IActionResult> GetByDepartment()
    {
        var data = await _context.Patients
            .GroupBy(p => p.Department)
            .Select(g => new
            {
                Department = g.Key,
                PatientCount = g.Count()
            })
            .ToListAsync();

        return Ok(data);
    }

    [HttpGet("wait-time-trend")]
    public async Task<IActionResult> GetWaitTimeTrend()
    {
        var data = await _context.KpiMetrics
            .Where(k => k.MetricName == "AvgWaitTime")
            .OrderByDescending(k => k.RecordedAt)
            .Take(30)
            .GroupBy(k => k.Department)
            .Select(g => new
            {
                Department = g.Key,
                AvgWaitTime = Math.Round(g.Average(k => k.Value), 1)
            })
            .ToListAsync();

        return Ok(data);
    }

    [HttpGet("alerts")]
    public async Task<IActionResult> GetAlerts()
    {
        var alerts = new List<object>();
        var avgWaitTime = await _context.Appointments.AverageAsync(a => a.WaitTimeMinutes);

        if (avgWaitTime > 30)
            alerts.Add(new { type = "warning", message = $"Average wait time is {Math.Round(avgWaitTime, 1)} mins — exceeds 30 min threshold!" });

        var cancelRate = await _context.Appointments.CountAsync(a => a.Status == "Cancelled") * 100.0
            / await _context.Appointments.CountAsync();

        if (cancelRate > 20)
            alerts.Add(new { type = "danger", message = $"Cancellation rate is {Math.Round(cancelRate, 1)}% — exceeds 20% threshold!" });

        if (!alerts.Any())
            alerts.Add(new { type = "success", message = "All KPIs within normal range!" });

        return Ok(alerts);
    }
}