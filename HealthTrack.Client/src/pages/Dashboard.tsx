import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getKpiSummary, getAlerts, getKpiByDepartment } from '../api/kpi';
import { Users, Calendar, Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import type { KpiSummary, Alert } from '../types';

const Dashboard = () => {
  const [kpi, setKpi] = useState<KpiSummary | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiData, alertsData, deptData] = await Promise.all([
          getKpiSummary(),
          getAlerts(),
          getKpiByDepartment(),
        ]);
        setKpi(kpiData);
        setAlerts(alertsData);
        setDepartments(deptData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome to HealthTrack Analytics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{kpi?.totalPatients}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{kpi?.totalAppointments}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <Calendar className="text-teal-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Wait Time</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{kpi?.avgWaitTimeMinutes} <span className="text-sm font-normal text-gray-500">mins</span></p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="text-amber-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{kpi?.todayAppointments}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">KPI Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  alert.type === 'warning' ? 'bg-amber-50 text-amber-800' :
                  alert.type === 'danger' ? 'bg-red-50 text-red-800' :
                  'bg-green-50 text-green-800'
                }`}
              >
                {alert.type === 'success' 
                  ? <CheckCircle size={18} /> 
                  : <AlertTriangle size={18} />}
                <span className="text-sm">{alert.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Patients by Department</h2>
          <div className="space-y-3">
            {departments.map((dept) => (
              <div key={dept.department} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-28">{dept.department}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full"
                    style={{ width: `${(dept.patientCount / (kpi?.totalPatients || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">{dept.patientCount}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;