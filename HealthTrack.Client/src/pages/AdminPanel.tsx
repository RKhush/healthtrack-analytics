import { useState } from 'react';
import Layout from '../components/Layout';
import { register } from '../api/auth';
import toast from 'react-hot-toast';
import { ShieldCheck, UserPlus } from 'lucide-react';

const AdminPanel = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Doctor');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(fullName, email, password, role);
      toast.success(`${role} account created successfully!`);
      setFullName('');
      setEmail('');
      setPassword('');
      setRole('Doctor');
    } catch (error) {
      toast.error('Failed to create account. Email may already exist.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
            <ShieldCheck className="text-teal-600" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500">Manage user accounts and system settings</p>
          </div>
        </div>

        {/* Create User Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="text-teal-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Create New User</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. John Smith"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@healthtrack.com"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="Doctor">Doctor</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition"
              >
                {isLoading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>

        {/* Role permissions info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h2>
          <div className="overflow-hidden rounded-lg border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Permission</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-medium">Admin</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-medium">Doctor</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-medium">Analyst</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { action: 'View Dashboard & Reports', admin: true, doctor: true, analyst: true },
                  { action: 'View Patients', admin: true, doctor: true, analyst: true },
                  { action: 'Add / Edit Patients', admin: true, doctor: true, analyst: false },
                  { action: 'Delete Patients', admin: true, doctor: false, analyst: false },
                  { action: 'Manage Appointments', admin: true, doctor: true, analyst: false },
                  { action: 'Upload CSV', admin: true, doctor: true, analyst: false },
                  { action: 'Access Admin Panel', admin: true, doctor: false, analyst: false },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{row.action}</td>
                    <td className="px-4 py-3 text-center">{row.admin ? '✅' : '❌'}</td>
                    <td className="px-4 py-3 text-center">{row.doctor ? '✅' : '❌'}</td>
                    <td className="px-4 py-3 text-center">{row.analyst ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;