namespace HealthTrack.API.Models;

public class KpiMetric
{
    public int Id { get; set; }
    public string MetricName { get; set; } = string.Empty;
    public double Value { get; set; }
    public string Department { get; set; } = string.Empty;
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
}