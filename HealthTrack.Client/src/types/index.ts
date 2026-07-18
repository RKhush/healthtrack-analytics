export interface User {
  fullName: string;
  email: string;
  role: string;
  token: string;
}

export interface Patient {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  department: string;
  registeredAt: string;
}

export interface KpiSummary {
  totalPatients: number;
  totalAppointments: number;
  avgWaitTimeMinutes: number;
  todayAppointments: number;
}

export interface Alert {
  type: string;
  message: string;
}