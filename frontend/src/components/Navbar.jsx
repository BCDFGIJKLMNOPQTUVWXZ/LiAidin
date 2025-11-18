import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Using the real hook now

const Navbar = () => {
  const { isLoggedIn, userRole } = useAuth();
  
  return (
    <nav className="bg-gray-800/70 backdrop-blur-sm shadow-xl sticky top-0 z-10 border-b border-teal-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo/Brand (LinkAi) */}
          <div className="flex items-center">
            <Link 
              to={isLoggedIn ? "/home" : "/home"} 
              className="text-2xl font-extrabold text-teal-400 tracking-wider hover:text-teal-300 transition duration-300"
            >
              LinkAi
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <NavLink to="/home">Dashboard</NavLink>
                <NavLink to="/form">Generator</NavLink>
                
                {/* 1. Admin Link Visibility controlled by RBAC */}
                {userRole === 'admin' && (
                  <NavLink 
                    to="/admin/dashboard" 
                    className="text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    Admin
                  </NavLink>
                )}
                
                {/* 2. Profile Link replaces the direct Logout button */}
                <NavLink 
                  to="/profile" 
                  className="px-3 py-2 text-sm bg-teal-600 rounded-lg font-semibold hover:bg-teal-700 transition duration-300 shadow-md"
                >
                  Profile
                </NavLink>
              </>
            ) : (
              // Links for unauthenticated users
              <>
                {/* 3. Login/Signup only shows when logged out */}
                <NavLink to="/home">Dashboard</NavLink>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, className = '' }) => (
  <Link 
    to={to} 
    className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${className}`}
  >
    {children}
  </Link>
);

export default Navbar;