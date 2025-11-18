// client/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Image2 from '../assets/image2.jpg';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const success = await login(email, password);

      if (!success) {
        setError("Invalid email or password");
        return;
      }

      // Successfully logged in
      navigate("/home");

    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password");
    }
  };

  const glassCardColor = 'bg-teal-900/40';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage: `url(${Image2})`,
        backgroundBlendMode: 'multiply',
        backgroundColor: 'rgba(12, 32, 32, 0.7)'
      }}
    >
      <div className={`w-full max-w-md p-8 rounded-xl shadow-2xl ${glassCardColor} backdrop-blur-lg border border-teal-500/30 text-white`}>
        
        <h2 className="text-3xl font-light text-center mb-6 text-teal-200">
          Sign In
        </h2>

        {error && <p className="text-red-400 text-center mb-3">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-teal-300 mb-1">
              E-mail address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white/10 border border-teal-500/50 rounded-lg 
              focus:ring-teal-500 focus:border-teal-500 text-white placeholder-teal-300/70 
              transition duration-300"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-teal-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white/10 border border-teal-500/50 rounded-lg 
              focus:ring-teal-500 focus:border-teal-500 text-white placeholder-teal-300/70 
              transition duration-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 rounded-lg 
            text-lg font-semibold shadow-lg transition duration-300"
          >
            Log in
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-teal-300">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-teal-400 hover:text-teal-300 transition duration-300">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
