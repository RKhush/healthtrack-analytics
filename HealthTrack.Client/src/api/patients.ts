import api from './axios';

export const getPatients = async (
  page = 1,
  pageSize = 10,
  search = '',
  department = ''
) => {
  const response = await api.get('/Patients', {
    params: { page, pageSize, search, department },
  });
  return response.data;
};

export const getPatientById = async (id: number) => {
  const response = await api.get(`/Patients/${id}`);
  return response.data;
};

export const createPatient = async (patient: any) => {
  const response = await api.post('/Patients', patient);
  return response.data;
};