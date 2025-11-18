import React from 'react';
import { useAuth } from '../context/AuthContext'; // Using our new hook
import { useNavigate, Navigate, Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const glassCardColor = 'bg-teal-900/40';

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  if (!user) return <Navigate to="/login" />; // Should be protected, but safety first

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="pb-8 border-b border-teal-700/50 mb-12">
        <h1 className="text-4xl font-light text-teal-400">My LinkAi Profile</h1>
      </header>

      <div className="max-w-xl mx-auto p-8 rounded-xl shadow-2xl bg-gray-800/60 backdrop-blur-lg border border-teal-600/40">
        <h2 className="text-3xl font-semibold mb-6 text-white">Account Details</h2>
        
        <div className="space-y-4">
          <DetailRow label="Name" value={user.name} />
          <DetailRow label="Email" value={user.email} />
          <DetailRow 
            label="Role" 
            value={userRole.toUpperCase()} 
            color={userRole === 'admin' ? 'text-amber-400' : 'text-teal-400'}
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-10 w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg text-lg font-semibold shadow-lg transition duration-300"
        >
          Log Out
        </button>
      </div>

      {userRole === 'admin' && (
        <div className="mt-8 text-center">
            <Link to="/admin/dashboard" className="text-amber-400 hover:text-amber-300 transition">
                Go to Admin Dashboard
            </Link>
        </div>
      )}
    </div>
  );
};

// Helper component for clean detail rows
const DetailRow = ({ label, value, color = 'text-gray-300' }) => (
    <div className="flex justify-between py-2 border-b border-gray-700/50">
        <span className="font-medium text-teal-300">{label}:</span>
        <span className={`font-semibold ${color}`}>{value}</span>
    </div>
);

export default ProfilePage;