# 🏥 HealthTrack Analytics

A full-stack health analytics SaaS platform built with **.NET 9**, **React**, **TypeScript**, and **Power BI Embedded**. Features JWT role-based authentication, real-time KPI dashboards, bulk CSV data ingestion, and live Power BI reports.

**Live Demo:** [healthtrack-analytics.vercel.app](https://healthtrack-analytics.vercel.app)  
**API Docs:** [healthtrack-api-ozbb.onrender.com/swagger](https://healthtrack-api-ozbb.onrender.com/swagger)

> ⚠️ The API is hosted on Render free tier — it may take **30 seconds to wake up** on first request. Just wait and refresh!

---

## 🚀 Demo Credentials

| Role    | Email                 | Password  |
| ------- | --------------------- | --------- |
| Admin   | admin@healthtrack.com | Admin@123 |
| Doctor  | _(register via app)_  | —         |
| Analyst | _(register via app)_  | —         |

---

## ✨ Features

- **JWT Authentication** — secure login with role-based access (Admin, Doctor, Analyst)
- **Patient Management** — searchable, filterable patient table with pagination
- **Appointment Tracking** — filter by status and department with summary KPIs
- **CSV Bulk Upload** — drag & drop CSV import with template download
- **Power BI Embedded** — live analytics dashboard with 3 interactive reports
- **KPI Alerts** — automatic warnings when metrics exceed thresholds
- **Admin Panel** — create user accounts and view role permissions
- **Real-time Dashboard** — total patients, appointments, avg wait time, alerts

---

## 🛠️ Tech Stack

| Layer           | Technology                                |
| --------------- | ----------------------------------------- |
| Frontend        | React 18, TypeScript, Vite, Tailwind CSS  |
| Backend         | .NET 9, ASP.NET Core Web API, C#          |
| Database        | PostgreSQL (Render) / SQL Server (local)  |
| ORM             | Entity Framework Core 9                   |
| Auth            | JWT Bearer Tokens                         |
| Analytics       | Power BI Embedded (public embed)          |
| Deployment      | Vercel (frontend) + Render (backend + DB) |
| Version Control | Git with feature branch strategy          |

---

## 📁 Project Structure

```
healthtrack-analytics/
├── HealthTrack.API/          # .NET 9 REST API
│   ├── Controllers/          # Auth, Patients, Appointments, KPI, CSV, PowerBI
│   ├── Data/                 # DbContext + DataSeeder
│   ├── Models/               # Patient, Appointment, KpiMetric, User
│   ├── DTOs/                 # Request/Response models
│   ├── Migrations/           # EF Core migrations
│   ├── Dockerfile            # Docker config for Render deployment
│   └── Program.cs            # App configuration
│
├── HealthTrack.Client/       # React + TypeScript frontend
│   ├── src/
│   │   ├── api/              # Axios instance + API calls
│   │   ├── components/       # Layout, Sidebar
│   │   ├── context/          # AuthContext (JWT state)
│   │   ├── pages/            # Dashboard, Patients, Appointments, CSV, Reports, Admin
│   │   └── types/            # TypeScript interfaces
│   └── vercel.json           # Vercel routing config
│
└── README.md
```

---

## 🔌 API Endpoints

### Auth

| Method | Endpoint             | Description           | Auth   |
| ------ | -------------------- | --------------------- | ------ |
| POST   | `/api/Auth/register` | Register new user     | Public |
| POST   | `/api/Auth/login`    | Login + get JWT token | Public |

### Patients

| Method | Endpoint             | Description                                 | Auth       |
| ------ | -------------------- | ------------------------------------------- | ---------- |
| GET    | `/api/Patients`      | Get all patients (search, filter, paginate) | Required   |
| GET    | `/api/Patients/{id}` | Get patient by ID                           | Required   |
| POST   | `/api/Patients`      | Create patient                              | Required   |
| PUT    | `/api/Patients/{id}` | Update patient                              | Required   |
| DELETE | `/api/Patients/{id}` | Delete patient                              | Admin only |

### Appointments

| Method | Endpoint                    | Description                             | Auth     |
| ------ | --------------------------- | --------------------------------------- | -------- |
| GET    | `/api/Appointments`         | Get all appointments (filter, paginate) | Required |
| GET    | `/api/Appointments/summary` | Get KPI summary                         | Required |
| POST   | `/api/Appointments`         | Create appointment                      | Required |
| PUT    | `/api/Appointments/{id}`    | Update appointment                      | Required |

### KPI

| Method | Endpoint                   | Description                                 | Auth     |
| ------ | -------------------------- | ------------------------------------------- | -------- |
| GET    | `/api/Kpi/summary`         | Total patients, appointments, avg wait time | Required |
| GET    | `/api/Kpi/by-department`   | Patient count per department                | Required |
| GET    | `/api/Kpi/wait-time-trend` | Avg wait time trend                         | Required |
| GET    | `/api/Kpi/alerts`          | Active KPI threshold alerts                 | Required |

### CSV

| Method | Endpoint                   | Description                   | Auth     |
| ------ | -------------------------- | ----------------------------- | -------- |
| POST   | `/api/Csv/upload-patients` | Bulk import patients from CSV | Required |
| GET    | `/api/Csv/template`        | Download CSV template         | Required |

---

## 🔐 Role Permissions

| Permission               | Admin | Doctor | Analyst |
| ------------------------ | ----- | ------ | ------- |
| View Dashboard & Reports | ✅    | ✅     | ✅      |
| View Patients            | ✅    | ✅     | ✅      |
| Add / Edit Patients      | ✅    | ✅     | ❌      |
| Delete Patients          | ✅    | ❌     | ❌      |
| Manage Appointments      | ✅    | ✅     | ❌      |
| Upload CSV               | ✅    | ✅     | ❌      |
| Access Admin Panel       | ✅    | ❌     | ❌      |

---

## 💻 Local Development Setup

### Prerequisites

- .NET 9 SDK
- Node.js v18+
- PostgreSQL 17
- Git

### 1. Clone the repo

```bash
git clone https://github.com/RKhush/healthtrack-analytics.git
cd healthtrack-analytics
git checkout develop
```

### 2. Backend setup

```bash
cd HealthTrack.API

# Install dependencies (auto-restored)
dotnet restore

# Update appsettings.json with your local PostgreSQL password
# "DefaultConnection": "Host=localhost;Database=HealthTrackDB;Username=postgres;Password=YOUR_PASSWORD"

# Run migrations
dotnet ef database update

# Start the API
dotnet run
```

API runs at: `http://localhost:5032`  
Swagger UI: `http://localhost:5032/swagger`

### 3. Frontend setup

```bash
cd HealthTrack.Client

# Install dependencies
npm install

# Start the dev server
npm run dev
```

App runs at: `http://localhost:5173`

---

## 🚀 Deployment

### Branch Strategy

```
main        → Production (auto-deploys to Vercel + triggers Render)
develop     → Integration branch (all features merged here first)
feature/*   → Individual feature branches
```

### Frontend — Vercel

- **Platform:** Vercel
- **Repo:** github.com/RKhush/healthtrack-analytics
- **Branch:** `main`
- **Root Directory:** `HealthTrack.Client`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variable:**
  - `VITE_API_URL` = `https://healthtrack-api-ozbb.onrender.com/api`

**To deploy:** Push to `main` → Vercel auto-deploys

### Backend — Render

- **Platform:** Render
- **Type:** Web Service (Docker)
- **Branch:** `main`
- **Dockerfile:** `HealthTrack.API/Dockerfile`
- **Environment Variables:**
  - `ConnectionStrings__DefaultConnection` = _(Render PostgreSQL internal URL)_
  - `Jwt__Key` = `HealthTrackSuperSecretKey2024!@#$%^&*`
  - `Jwt__Issuer` = `HealthTrack.API`
  - `Jwt__Audience` = `HealthTrack.Client`
  - `ASPNETCORE_ENVIRONMENT` = `Production`

**To deploy:** Push to `main` → Render auto-deploys

### Database — Render PostgreSQL

- **Platform:** Render
- **Plan:** Free tier
- **Name:** `healthtrack-db`
- Migrations run automatically on startup via `db.Database.Migrate()`
- Data is seeded automatically on first run (500 patients, 1000 appointments)

---

## 🔄 Development Workflow

```bash
# Start new feature
git checkout develop
git checkout -b feature/your-feature-name

# Work on feature, commit regularly
git add .
git commit -m "feat: description of change"

# Push feature branch
git push origin feature/your-feature-name

# Merge to develop when done
git checkout develop
git merge feature/your-feature-name
git push origin develop

# Deploy to production
git checkout main
git merge develop
git push origin main
```

---

## 📊 Power BI Reports

The Reports page embeds a live Power BI dashboard with 3 visuals:

1. **Patients by Department** — Pie chart showing distribution
2. **Appointments by Status** — Bar chart (Scheduled, Completed, Cancelled)
3. **Avg Wait Time by Department** — Column chart

> Note: Power BI report uses public embed (Publish to Web). Data is refreshed manually in Power BI Desktop.  
> In production, this would use DirectQuery mode with scheduled refresh for real-time data.

---

## 🏗️ Architecture Notes

- **Auth pattern:** JWT Bearer tokens stored in localStorage, attached via Axios interceptors
- **Role-based UI:** Frontend checks `user.role` to show/hide features
- **Role-based API:** `[Authorize(Roles = "Admin")]` on sensitive endpoints
- **Circular reference:** Handled via `ReferenceHandler.IgnoreCycles` in JSON serialization
- **DateTime:** `AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true)` for PostgreSQL compatibility
- **CORS:** Currently allows all origins (`AllowAnyOrigin`) for portfolio demo

### Future Enhancements

- Patient Portal — patients log in to view their own appointments
- Real-time updates via SignalR
- Power BI DirectQuery for live data refresh
- Restrict CORS to specific domains in production
- Email notifications for KPI alerts
- Export reports to PDF/Excel

---

## 👩‍💻 Author

**Khushbuben Rathva**  
Full-Stack Developer | Ottawa, ON | Authorized to work in Canada  
[LinkedIn](https://www.linkedin.com/in/khushbu-rathva-56498a17a/) | [Portfolio](https://rkhush.github.io/portfolio/)
