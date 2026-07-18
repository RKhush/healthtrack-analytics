import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';

const Appointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [department, setDepartment] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const departments = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Oncology'];
  const statuses = ['All', 'Scheduled', 'Completed', 'Cancelled'];

  useEffect(() => {
    fetchData();
  }, [page, status, department]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [apptRes, summaryRes] = await Promise.all([
        api.get('/Appointments', {
          params: {
            page,
            pageSize: 10,
            status: status === 'All' ? '' : status,
            department: department === 'All' ? '' : department
          }
        }),
        api.get('/Appointments/summary')
      ]);
      setAppointments(apptRes.data.data);
      setTotal(apptRes.data.total);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-50 text-green-700';
      case 'Cancelled': return 'bg-red-50 text-red-700';
      default: return 'bg-blue-50 text-blue-700';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500">{total} total appointments</p>
        </div>

        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={16} className="text-blue-500" />
                <span className="text-xs text-gray-500">Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.totalAppointments}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={16} className="text-teal-500" />
                <span className="text-xs text-gray-500">Today</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.todayAppointments}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-xs text-gray-500">Completed</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.completed}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-amber-500" />
                <span className="text-xs text-gray-500">Avg Wait</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(summary.avgWaitTime)}<span className="text-sm font-normal text-gray-500"> mins</span></p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4 flex-wrap">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {statuses.map(s => <option key={s} value={s === 'All' ? '' : s}>{s}</option>)}
          </select>

          <select
            value={department}
            onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {departments.map(d => <option key={d} value={d === 'All' ? '' : d}>{d}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Wait Time</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{apt.patient?.fullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{apt.doctorName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{apt.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(apt.appointmentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{apt.waitTimeMinutes} mins</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">Page {page} of {Math.ceil(total/10)}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="px-3 py-1 rounded border border-gray-200 text-sm disabled:opacity-50 hover:bg-gray-50">
                Prev
              </button>
              <button onClick={() => setPage(p => Math.min(Math.ceil(total/10), p+1))} disabled={page === Math.ceil(total/10)}
                className="px-3 py-1 rounded border border-gray-200 text-sm disabled:opacity-50 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;