namespace HealthTrack.API.Models;

public class Appointment
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public string Department { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public int WaitTimeMinutes { get; set; }
    public string Status { get; set; } = "Scheduled"; // Scheduled, Completed, Cancelled
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}