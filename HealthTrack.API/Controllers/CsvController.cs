using CsvHelper;
using CsvHelper.Configuration;
using HealthTrack.API.Data;
using HealthTrack.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace HealthTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CsvController : ControllerBase
{
    private readonly AppDbContext _context;

    public CsvController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("upload-patients")]
    public async Task<IActionResult> UploadPatients(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        if (!file.FileName.EndsWith(".csv"))
            return BadRequest("Only CSV files are allowed.");

        var patients = new List<Patient>();
        var errors = new List<string>();

        using var reader = new StreamReader(file.OpenReadStream());
        using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            MissingFieldFound = null
        });

        var records = csv.GetRecords<dynamic>().ToList();

        foreach (var record in records)
        {
            try
            {
                var dict = (IDictionary<string, object>)record;
                patients.Add(new Patient
                {
                    FullName = dict["FullName"]?.ToString() ?? "",
                    Email = dict["Email"]?.ToString() ?? "",
                    Phone = dict["Phone"]?.ToString() ?? "",
                    DateOfBirth = DateTime.Parse(dict["DateOfBirth"]?.ToString() ?? DateTime.Now.ToString()),
                    Gender = dict["Gender"]?.ToString() ?? "",
                    Department = dict["Department"]?.ToString() ?? ""
                });
            }
            catch (Exception ex)
            {
                errors.Add($"Row error: {ex.Message}");
            }
        }

        if (patients.Any())
        {
            _context.Patients.AddRange(patients);
            await _context.SaveChangesAsync();
        }

        return Ok(new
        {
            imported = patients.Count,
            errors = errors.Count,
            errorDetails = errors
        });
    }

    [HttpGet("template")]
    public IActionResult DownloadTemplate()
    {
        var csv = "FullName,Email,Phone,DateOfBirth,Gender,Department\n";
        csv += "John Doe,john@example.com,555-0100,1985-06-15,Male,Cardiology\n";
        csv += "Jane Smith,jane@example.com,555-0101,1990-03-22,Female,Neurology\n";

        var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
        return File(bytes, "text/csv", "patients_template.csv");
    }
}