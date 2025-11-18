import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Component Files - CHECKING FOLDER PATHS:
import Navbar from './components/Navbar.jsx';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';

// Import Pages
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignUpPage.jsx';
import HomePage from './pages/HomePage.jsx'; // Public page
import MessageFormPage from './pages/MessageFormPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProfilePage from './pages/ProfilePage.jsx'; 


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar /> 
        
        <Routes>
          
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" />} />
          
          {/* CRITICAL FIX: The Home Page is now PUBLIC and does NOT use ProtectedRoute */}
          <Route path="/home" element={<HomePage />} /> 

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} /> 

          {/* Protected Routes (Requires Authentication) */}
          
          {/* Message Form, Profile, and Admin Dashboard MUST remain protected */}
          <Route 
            path="/form" 
            element={
              <ProtectedRoute>
                <MessageFormPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={ 
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          
          {/* Admin-Only Route (RBAC Implementation) */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<h1 className="text-white p-10">404: Page Not Found</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;