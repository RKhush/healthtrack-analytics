import api from './axios';

export const getKpiSummary = async () => {
  const response = await api.get('/Kpi/summary');
  return response.data;
};

export const getKpiByDepartment = async () => {
  const response = await api.get('/Kpi/by-department');
  return response.data;
};

export const getAlerts = async () => {
  const response = await api.get('/Kpi/alerts');
  return response.data;
};

export const getAppointmentSummary = async () => {
  const response = await api.get('/Appointments/summary');
  return response.data;
};