// client/src/pages/AdminDashboard.jsx
import React from 'react';

const AdminDashboard = () => {
  return (
    // Note: This page must be wrapped with a <ProtectedRoute role="admin"> component in App.jsx
    <div className="min-h-screen bg-gray-950 text-white p-12">
      <h1 className="text-4xl font-bold text-red-500 mb-8 border-b border-red-700 pb-4">
        🔒 Admin System Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User Stats Card */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-l-4 border-red-500">
          <h3 className="text-2xl font-semibold text-red-300 mb-2">Total Users</h3>
          <p className="text-5xl font-extrabold">128</p>
          <p className="text-sm text-gray-400 mt-2">10 New in last 7 days</p>
        </div>
        
        {/* Message Usage Card */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-l-4 border-red-500">
          <h3 className="text-2xl font-semibold text-red-300 mb-2">Total Messages Generated</h3>
          <p className="text-5xl font-extrabold">4,590</p>
          <p className="text-sm text-gray-400 mt-2">AI Cost Monitoring</p>
        </div>
        
        {/* System Health Card */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-l-4 border-red-500">
          <h3 className="text-2xl font-semibold text-red-300 mb-2">Database Status</h3>
          <p className="text-2xl font-semibold text-green-400 mt-2">MySQL: Connected</p>
          <p className="text-2xl font-semibold text-green-400 mt-2">Gemini API: Operational</p>
        </div>

      </div>
      
      <div className="mt-10 bg-gray-800/70 p-6 rounded-xl shadow-xl border border-red-700/50">
        <h3 className="text-2xl font-semibold text-red-300 mb-4">User Management Table (Future Feature)</h3>
        <p className="text-gray-400">Implement a table here to view, edit roles (normal/admin), and delete user accounts directly from the database.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;