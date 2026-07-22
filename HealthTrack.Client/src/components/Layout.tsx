import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Upload, 
  BarChart3, 
  LogOut,
  ShieldCheck
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/patients', label: 'Patients', icon: Users },
  { path: '/appointments', label: 'Appointments', icon: Calendar },
  { path: '/upload', label: 'CSV Upload', icon: Upload },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-blue-950 text-white flex flex-col">
        
        {/* Logo */}
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
              <span className="font-bold text-sm">HT</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">HealthTrack</h1>
              <p className="text-blue-300 text-xs">Analytics</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Admin Panel — only visible to Admin */}
          {isAdmin() && (
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === '/admin'
                  ? 'bg-teal-600 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <ShieldCheck size={18} />
              <span className="text-sm font-medium">Admin Panel</span>
            </Link>
          )}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-teal-500 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.fullName?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.fullName}</p>
              <p className="text-blue-300 text-xs">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-blue-300 hover:text-white text-sm w-full px-2 py-1 rounded-lg hover:bg-blue-800 transition"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;