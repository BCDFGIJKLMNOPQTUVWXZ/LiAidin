// client/src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
// import { useAuth } from '../context/AuthContext';
import TypingText from "../components/TypingText.jsx"; // The dynamic text component

const HomePage = () => {
  // MOCK DATA - REPLACE WITH REAL CONTEXT HOOK
  const userRole = "normal";
  const userName = "Networking Pro";

  // The full phrase for the typing animation
  const headlinePhrase = "Amplify Your Connections";
  const staticDescription =
    "Craft impactful, personalized LinkedIn messages with the power of AI. Discover and engage with the right professionals, effortlessly.";

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center pb-8 border-b border-gray-700/50 mb-12">
        <h1 className="text-4xl font-light text-teal-400">
          Welcome, {userName}!
        </h1>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* LEFT COLUMN: Dynamic Headline and Static Description */}
        <div className="space-y-6 text-center lg:text-left pt-10">
          <p className="text-xl font-medium text-teal-300">
            Intelligent Networking
          </p>

          {/* DYNAMIC HEADLINE WITH TYPING EFFECT */}
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight min-h-[5rem]">
            <TypingText
              text={headlinePhrase} // headlinePhrase is "Amplify Your Connections"
              delay={80}
              infinite={true}
              className="text-white" // This sets the color for "Your Connections"
            />
          </h2>
          {/* Note: If you want only 'Amplify' to be teal, that requires a more complex 
             logic inside TypingText to handle styled parts of the string. For this 
             simple version, the whole string is typed, fulfilling the typing request.*/}

          {/* STATIC DESCRIPTION */}
          <p className="text-lg md:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed min-h-[4rem]">
            {staticDescription}
          </p>

          {/* Main Call to Action */}
          <Link
            to="/form"
            className="inline-block px-10 py-4 bg-teal-600 hover:bg-teal-700 rounded-full text-lg font-semibold text-white shadow-xl transition duration-300 transform hover:scale-105 mt-6"
          >
            Start Generating Messages
          </Link>
        </div>

        {/* RIGHT COLUMN: Successful Conversation Showcase (Corrected Layout) */}
        <div className="relative flex flex-col items-center justify-center p-8 h-full min-h-[50vh]">
          
          {/* Main Chat Window Card */}
          <div className={`w-full max-w-lg h-[400px] p-6 bg-gray-800/60 rounded-3xl shadow-2xl border border-teal-600/40 backdrop-blur-lg flex flex-col`}>
            
            {/* Professional Chat Header */}
            <div className="flex items-center pb-4 border-b border-gray-700/50 mb-4">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                  A
              </div>
              <div className="text-sm font-semibold text-teal-300">
                  Aisha H. (Google PM)
              </div>
              <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Conversation Messages */}
            <div className="flex-grow space-y-4 px-2 overflow-y-auto custom-scrollbar">
                
                <div className="flex justify-start"> 
                    <div className="bg-gray-700 p-3 rounded-xl max-w-[85%] text-sm shadow-lg border border-gray-600">
                        "Hello Aisha, your recent work on Kubernetes efficiency at Google was truly impressive! I'd love to briefly connect for an informational chat about your career path in product management."
                    </div>
                </div>
                
                <div className="flex justify-end"> 
                    <div className="bg-teal-700/80 p-3 rounded-xl max-w-[85%] text-sm shadow-lg border border-teal-600/50">
                        "Thanks for the kind words! I appreciate the personalized message. I'd be happy to share my insights. When are you free next week?"
                    </div>
                </div>
                
                <div className="flex justify-start">
                    <div className="bg-gray-700 p-3 rounded-xl max-w-[85%] text-sm shadow-lg border border-gray-600">
                        "That's great! How about Tuesday at 1 PM PST? My schedule is flexible."
                    </div>
                </div>
            </div>
            {/* End of Main Chat Window Card */}
          </div>
        </div>
      </main>

      {/* Admin Dashboard Link (RBAC) */}
      {userRole === "admin" && (
        <footer className="mt-20 pt-8 border-t border-gray-700/50 text-center">
          <p className="text-gray-400 text-sm">
            <Link
              to="/admin/dashboard"
              className="text-amber-400 hover:text-amber-300 transition duration-300 font-medium"
            >
              Admin Area Access
            </Link>
          </p>
        </footer>
      )}
    </div>
  );
};

export default HomePage;
