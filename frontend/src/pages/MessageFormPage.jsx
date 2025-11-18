import React, { useState, useMemo } from "react";
import axios from "axios"; // Required for authenticated requests
import { useAuth } from "../context/AuthContext.jsx";

// --- Configuration Data based on the Feature Blueprint ---
const USER_INTENTS = [
  {
    value: "Referral",
    label: "Referral (Seeking a Job)",
    params: ["Target Role", "Target Company"], 
  },
  {
    value: "Networking",
    label: "Networking/General Connection",
    params: ["Target Industry"],
  },
  {
    value: "Mentorship",
    label: "Mentorship (Seeking Guidance)",
    params: ["Target Expertise / Field", "Experience Level"],
  },
  {
    value: "Collaboration",
    label: "Collaboration (Project/Research)",
    params: ["Target Skill / Domain", "Organization Type"],
  },
  { value: "Client Outreach", label: "Client Outreach / Sales", params: [] },
  {
    value: "Recruiter / Job Inquiry",
    label: "Recruiter / Job Inquiry (Open Roles)",
    params: ["Target Role", "Target Company"], // Location removed
  },
  {
    value: "Investor Interest",
    label: "Investor / Funding Interest",
    params: ["Investment Focus", "Company Stage"],
  },
  {
    value: "Event Follow-up",
    label: "Event / Conference Follow-up",
    params: [],
  },
];

const MessageFormPage = () => {
  // const { token } = useAuth(); // If you need to check auth state explicitly

  const [generatedUrl, setGeneratedUrl] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [aiFeedback, setAiFeedback] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [userMessage, setUserMessage] = useState(""); 

  const [formData, setFormData] = useState({
    intent: "Referral",
    targetRole: "",
    targetCompany: "",
    targetBio: "",
    userSkill: "",
    desiredTone: "Formal",
  });

  // Dynamically determine the adaptive parameters
  const adaptiveParams = useMemo(() => {
    const selectedIntent = USER_INTENTS.find(
      (i) => i.value === formData.intent
    );
    return selectedIntent
      ? selectedIntent.params
      : []; 
  }, [formData.intent]);
  
  // NEW: Checks if ANY primary adaptive field for the current intent has been filled
  const isPrimaryParamFilled = useMemo(() => {
      const selectedIntentConfig = USER_INTENTS.find(i => i.value === formData.intent);
      if (!selectedIntentConfig || selectedIntentConfig.params.length === 0) return true;
      
      const firstParamName = selectedIntentConfig.params[0].replace(/[^a-zA-Z0-9]/g, '');
      const secondParamName = selectedIntentConfig.params.length > 1 ? selectedIntentConfig.params[1].replace(/[^a-zA-Z0-9]/g, '') : null;

      // Check if the first parameter OR the second parameter has a value
      return (formData[firstParamName] && formData[firstParamName].trim() !== '') || 
             (secondParamName && formData[secondParamName] && formData[secondParamName].trim() !== '');
  }, [formData]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- UNIVERSAL handleGenerateSearchUrl ---
  const handleGenerateSearchUrl = () => {
    let mainSearchTerm = "";
    
    const selectedIntentConfig = USER_INTENTS.find(i => i.value === formData.intent);
    
    if (selectedIntentConfig && selectedIntentConfig.params.length > 0) {
        
        // Priority 1: Check for Role/Company keys (used by Referral/Recruiter)
        const targetRoleValue = formData["TargetRole"];
        const targetCompanyValue = formData["TargetCompany"];

        if (targetRoleValue || targetCompanyValue) {
            // If Role or Company is present, combine them
            mainSearchTerm = `${targetRoleValue || ''} at ${targetCompanyValue || ''}`;
        } else {
            // Priority 2: Use the primary adaptive parameter for other intents
            const firstParamName = selectedIntentConfig.params[0].replace(/[^a-zA-Z0-9]/g, '');
            mainSearchTerm = formData[firstParamName];
        }
    }

    // Validation Check
    if (!mainSearchTerm || mainSearchTerm.trim() === 'at') {
      alert(`Please fill in the primary adaptive parameter for the selected goal (${formData.intent}) to generate a search URL.`);
      setGeneratedUrl(''); 
      return;
    }

    // Generate Link
    const encodedSearch = encodeURIComponent(mainSearchTerm.trim());
    
    // Use the optimized /people/ search endpoint
    const optimizedUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodedSearch}`;

    setGeneratedUrl(optimizedUrl);
  };

  // --- CORE FUNCTION: Connects to Express Backend using AXIOS (Bearer Token) ---
  const handleGenerateMessage = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAiMessage("Crafting a personalized connection request...");
    setAiFeedback(null);

    // Data payload for the AI service
    const payload = {
      intent: formData.intent,
      targetBio: formData.targetBio,
      userSkill: formData.userSkill,
      desiredTone: formData.desiredTone,
    };

    try {
        // Use Axios, which automatically includes the Authorization: Bearer token
        const response = await axios.post(
            "http://localhost:5000/api/v1/ai/generate-message",
            payload
        );

        const data = response.data; // Axios response body is in .data

        // Update state with successful AI response (Mode A)
        setAiMessage(data.message);
        setAiFeedback(data.feedback);
        
    } catch (error) {
        console.error("AI Generation Error:", error);

        // Handle 401 Unauthorized error specifically
        if (error.response && error.response.status === 401) {
            setAiMessage("🛑 AUTHENTICATION REQUIRED: Please log in to use the AI Generator. (Token Expired or Invalid)");
        } else {
            // Handle all other network/server errors
            const errorMessage = error.response?.data?.error || error.message;
            setAiMessage(`❌ Server Error: ${errorMessage}`);
        }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Placeholder for Mode B Logic ---
  const handleModeBFeedback = () => {
    if (!userMessage.trim()) {
      alert("Please paste a message into the text area first.");
      return;
    }
    // Placeholder alert for Mode B Scorecard
    alert(
      `Evaluating message:\n\n${userMessage.substring(
        0,
        50
      )}...\n\nScorecard Simulation:\nTone: 90%, Clarity: 95% (See blueprint)`
    );
  };

  // --- Styles ---
  const inputStyle =
    "w-full p-3 bg-gray-700/70 border border-teal-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 transition duration-300";
  const labelStyle = "block text-sm font-medium text-teal-300 mb-1";
  const sectionHeaderStyle =
    "text-xl font-semibold text-teal-200 border-b border-teal-700/50 pb-2 mb-4";
  const buttonStyle = (color) =>
    `w-full py-3 ${color} rounded-lg font-semibold transition`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-teal-400 mb-8">
        AI Message Generator
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* LEFT COLUMN: Input Forms */}
        <div className="space-y-8">
          {/* --- USER INTENT / ADAPTIVE PARAMETERS --- */}
          <div className="bg-gray-800/60 p-6 rounded-xl shadow-xl border border-teal-600/40">
            <h2 className={sectionHeaderStyle}>
              1. Set Connection Goal & Target
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelStyle}>
                  Your Connection Goal (User Intent)
                </label>
                <select
                  name="intent"
                  value={formData.intent}
                  onChange={handleInputChange}
                  className={inputStyle}
                >
                  {USER_INTENTS.map((intent) => (
                    <option
                      key={intent.value}
                      value={intent.value}
                      className="bg-gray-700"
                    >
                      {intent.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Adaptive Parameters */}
              <h3 className="text-md font-medium text-teal-300 pt-2">
                Adaptive Parameters:
              </h3>
              {adaptiveParams.map((param, index) => (
                <div key={index}>
                  <label className={labelStyle}>{param}</label>
                  <input
                    type="text"
                    name={param.replace(/[^a-zA-Z0-9]/g, "")} // Sets CamelCase name (e.g., TargetRole)
                    value={formData[param.replace(/[^a-zA-Z0-9]/g, "")] || ""}
                    onChange={handleInputChange}
                    className={inputStyle}
                    placeholder={`Enter ${param.toLowerCase()}...`}
                  />
                </div>
              ))}

              {/* LinkedIn Search URL Generation Button */}
              <button
                onClick={handleGenerateSearchUrl}
                className={buttonStyle("bg-sky-600 hover:bg-sky-700")}
                disabled={!isPrimaryParamFilled}
              >
                Generate LinkedIn Search URL
              </button>
            </div>
          </div>

          <hr className="border-teal-700/50" />

          {/* --- MESSAGE DATA INPUT FORM --- */}
          <div className="bg-gray-800/60 p-6 rounded-xl shadow-xl border border-teal-600/40">
            <h2 className={sectionHeaderStyle}>
              2. Message Customization Data 📝
            </h2>
            <form onSubmit={handleGenerateMessage} className="space-y-4">
              <div>
                <label className={labelStyle}>
                  Target Person's 'About' Section (Target Bio)
                </label>
                <textarea
                  rows="4"
                  name="targetBio"
                  value={formData.targetBio}
                  onChange={handleInputChange}
                  className={inputStyle}
                  placeholder="Paste the key accomplishments or projects here for personalization... (Target Bio)"
                ></textarea>
              </div>

              <div>
                <label className={labelStyle}>
                  Your Key Achievement/Skill (User Skills)
                </label>
                <input
                  type="text"
                  name="userSkill"
                  value={formData.userSkill}
                  onChange={handleInputChange}
                  className={inputStyle}
                  placeholder="e.g., Led 20% growth in X metric"
                />
              </div>

              <div>
                <label className={labelStyle}>Desired Tone (Optional)</label>
                <select
                  name="desiredTone"
                  value={formData.desiredTone}
                  onChange={handleInputChange}
                  className={inputStyle}
                >
                  <option className="bg-gray-700">Formal</option>
                  <option className="bg-gray-700">Enthusiastic</option>
                  <option className="bg-gray-700">Respectful</option>
                  <option className="bg-gray-700">Friendly</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={buttonStyle(
                  isLoading ? "bg-teal-800/50" : "bg-teal-600 hover:bg-teal-700"
                )}
              >
                {isLoading ? "Generating..." : "Generate Personalized Message"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Output */}
        <div className="space-y-8">
          {/* --- SEARCH URL OUTPUT --- */}
          <div className="bg-gray-800/60 p-6 rounded-xl shadow-xl border border-teal-600/40">
            <h2 className={sectionHeaderStyle}>
              LinkedIn Search URL (Find Target)
            </h2>
            {generatedUrl ? (
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-teal-400 break-words hover:underline"
              >
                {generatedUrl}
              </a>
            ) : (
              <p className="text-gray-400">
                Enter a Role/Company and click the "Generate LinkedIn Search
                URL" button.
              </p>
            )}
          </div>

          {/* --- AI MESSAGE OUTPUT --- */}
          <div className="bg-gray-800/60 p-6 rounded-xl shadow-xl border border-teal-600/40">
            <h2 className={sectionHeaderStyle}>
              Generated AI Message (Ready to Copy)
            </h2>
            <div className="h-full space-y-4">
              {aiMessage ? (
                <textarea
                  readOnly
                  value={aiMessage}
                  rows="10"
                  className="w-full p-4 bg-gray-700/50 rounded-lg text-white font-mono resize-none focus:outline-none"
                />
              ) : (
                <p className="text-gray-400">
                  The generated message will appear here after submission.
                </p>
              )}

              {/* --- AI GENERATED MESSAGE FEEDBACK (Mode A) --- */}
              {aiFeedback && (
                <div className="bg-teal-900/40 p-3 rounded-lg border border-teal-600/50">
                  <h3 className="text-md font-semibold text-teal-300">
                    AI Auto-Feedback (Mode A)
                  </h3>
                  <p className="text-sm mt-1 text-white">
                    **Tone Alignment**: {aiFeedback.toneAlignment}%
                  </p>
                  <p className="text-sm mt-1 text-white">
                    **Suggestion**: {aiFeedback.suggestion}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* --- USER MESSAGE FEEDBACK (Mode B - AI Networking Coach) --- */}
          <div className="bg-gray-800/60 p-6 rounded-xl shadow-xl border border-teal-600/40">
            <h2 className={sectionHeaderStyle}>
              3. AI Networking Coach (Mode B) 🎓
            </h2>
            
            <p className="text-sm text-gray-400 mb-3">
              Paste your own message to get an evaluation scorecard.
            </p>
            <textarea
              rows="4"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className={inputStyle}
              placeholder="Paste your own connection message here for feedback (Tone %, Clarity %, etc.)"
            />
            <button
              onClick={handleModeBFeedback}
              className={buttonStyle(
                "bg-fuchsia-600 hover:bg-fuchsia-700 mt-4"
              )}
            >
              Get Scorecard & Improvement Tips
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageFormPage;