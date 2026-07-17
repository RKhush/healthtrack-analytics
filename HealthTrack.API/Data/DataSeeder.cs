using Bogus;
using HealthTrack.API.Models;

namespace HealthTrack.API.Data;

public static class DataSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (context.Patients.Any()) return;

        var departments = new[] { "Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Oncology" };
        var doctors = new[] { "Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown", "Dr. Davis" };

        // Seed Patients
        var patientFaker = new Faker<Patient>()
            .RuleFor(p => p.FullName, f => f.Name.FullName())
            .RuleFor(p => p.Email, f => f.Internet.Email())
            .RuleFor(p => p.Phone, f => f.Phone.PhoneNumber())
            .RuleFor(p => p.DateOfBirth, f => f.Date.Past(60, DateTime.Now.AddYears(-18)))
            .RuleFor(p => p.Gender, f => f.PickRandom("Male", "Female"))
            .RuleFor(p => p.Department, f => f.PickRandom(departments))
            .RuleFor(p => p.RegisteredAt, f => f.Date.Past(2));

        var patients = patientFaker.Generate(500);
        context.Patients.AddRange(patients);
        context.SaveChanges();

        // Seed Appointments
        var appointmentFaker = new Faker<Appointment>()
            .RuleFor(a => a.PatientId, f => f.PickRandom(patients).Id)
            .RuleFor(a => a.Department, f => f.PickRandom(departments))
            .RuleFor(a => a.DoctorName, f => f.PickRandom(doctors))
            .RuleFor(a => a.AppointmentDate, f => f.Date.Between(DateTime.Now.AddMonths(-6), DateTime.Now.AddMonths(1)))
            .RuleFor(a => a.WaitTimeMinutes, f => f.Random.Int(5, 90))
            .RuleFor(a => a.Status, f => f.PickRandom("Scheduled", "Completed", "Cancelled"))
            .RuleFor(a => a.CreatedAt, f => f.Date.Past(1));

        var appointments = appointmentFaker.Generate(1000);
        context.Appointments.AddRange(appointments);
        context.SaveChanges();

        // Seed KPI Metrics
        var metrics = new List<KpiMetric>();
        foreach (var dept in departments)
        {
            for (int i = 0; i < 30; i++)
            {
                metrics.Add(new KpiMetric { MetricName = "AvgWaitTime", Value = new Random().Next(10, 60), Department = dept, RecordedAt = DateTime.Now.AddDays(-i) });
                metrics.Add(new KpiMetric { MetricName = "PatientSatisfaction", Value = new Random().NextDouble() * 2 + 3, Department = dept, RecordedAt = DateTime.Now.AddDays(-i) });
                metrics.Add(new KpiMetric { MetricName = "DailyAdmissions", Value = new Random().Next(5, 30), Department = dept, RecordedAt = DateTime.Now.AddDays(-i) });
            }
        }
        context.KpiMetrics.AddRange(metrics);

        // Seed Admin User
        context.Users.Add(new User
        {
            FullName = "Admin User",
            Email = "admin@healthtrack.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = "Admin"
        });

        context.SaveChanges();
    }
}