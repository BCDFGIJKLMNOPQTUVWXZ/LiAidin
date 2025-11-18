// src/services/aiService.js (ES Module Format)

import { GoogleGenAI } from '@google/genai';
import 'dotenv/config'; // Use this import to load .env in ES Module

// The API key is loaded from the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-2.5-flash"; // A fast and capable model for this task

/**
 * Calls the Gemini API to generate a personalized message and auto-feedback in JSON format.
 * @param {object} data - Structured input from the frontend form.
 * @returns {object} - The generated message and Mode A feedback.
 */
export const generateMessageAndFeedback = async (data) => {
    const { 
        intent, 
        targetBio, 
        userSkill, 
        desiredTone 
    } = data;

    // --- 1. Craft the Detailed System Prompt ---

    const systemInstruction = `
        You are an expert LinkedIn Networking Assistant. Your task is to generate a professional, highly personalized connection message and provide an evaluation of your generated message.
        
        The user's intent defines the goal, and the desired tone must be reflected. The generated message should use the Target Person's Bio for personalization and integrate the User's Key Achievement/Skill.
        
        The final output MUST be a single JSON object.
    `;

    const userPrompt = `
        **USER INPUTS:**
        1. **Intent (Goal):** ${intent}
        2. **Target Person's Bio (for personalization):** ${targetBio}
        3. **User's Achievement/Skill:** ${userSkill}
        4. **Desired Tone:** ${desiredTone}
        
        **REQUIRED JSON OUTPUT STRUCTURE:**
        {
          "message": "[Your full, generated LinkedIn message text, ready to copy/paste]",
          "feedback": {
            "toneAlignment": [Score from 60 to 100 for tone alignment with intent/desiredTone],
            "suggestion": "[A concise suggestion for improvement, following the Mode A rule: 'AI evaluates tone alignment and suggests better phrasing or tone adjustments automatically.']"
          }
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
            }
        });

        // Gemini's response text contains the JSON string
        const jsonResponse = JSON.parse(response.text.trim());
        
        return {
            message: jsonResponse.message,
            feedback: jsonResponse.feedback
        };

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw new Error("Failed to connect to the AI model or parse response.");
    }
};

// Now exported above using 'export const'