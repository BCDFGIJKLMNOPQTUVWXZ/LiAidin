// client/src/pages/SignupPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Image1 from "../assets/image1.jpg"; // Import Image 1
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const glassCardColor = "bg-teal-900/40";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🔥 Automatically log in the user with the same email + password
        await login(formData.email, formData.password);

        navigate("/home");
      } else {
        alert(`Registration failed: ${data.message || "Server error"}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center" // Added bg-cover, bg-center
      style={{
        backgroundImage: `url(${Image1})`, // Use Image1 here
        // Optional: Add a subtle overlay for better text readability
        backgroundBlendMode: "multiply",
        backgroundColor: "rgba(12, 32, 32, 0.7)", // Dark teal overlay
      }}
    >
      <div
        className={`w-full max-w-md p-8 rounded-xl shadow-2xl ${glassCardColor} backdrop-blur-lg border border-teal-500/30 text-white`}
      >
        <h2 className="text-3xl font-light text-center mb-6 text-teal-200">
          Sign Up
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-teal-300 mb-1"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Full Name"
              onChange={handleChange}
              value={formData.name}
              required
              className="w-full p-3 bg-white/10 border border-teal-500/50 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-white placeholder-teal-300/70 transition duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-teal-300 mb-1"
            >
              E-mail address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Your email"
              onChange={handleChange}
              value={formData.email}
              required
              className="w-full p-3 bg-white/10 border border-teal-500/50 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-white placeholder-teal-300/70 transition duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-teal-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password (min 6 characters)"
              onChange={handleChange}
              value={formData.password}
              required
              minLength="6"
              className="w-full p-3 bg-white/10 border border-teal-500/50 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-white placeholder-teal-300/70 transition duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-teal-300 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Re-enter Password"
              onChange={handleChange}
              value={formData.confirmPassword}
              required
              className="w-full p-3 bg-white/10 border border-teal-500/50 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-white placeholder-teal-300/70 transition duration-300"
            />
          </div>

          <p className="text-xs text-center text-teal-300/70 pt-2">
            By creating an account, you agree and accept our{" "}
            <span className="underline">Terms and Privacy Policy</span>.
          </p>

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 rounded-lg text-lg font-semibold shadow-lg transition duration-300 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-teal-600/50"
          >
            Sign up
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-teal-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-teal-400 hover:text-teal-300 transition duration-300"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
