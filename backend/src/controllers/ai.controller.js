// src/controllers/aiController.js

import { generateMessageAndFeedback } from '../services/ai.service.js';

/**
 * Controller function to handle POST requests for message generation.
 * It validates input, calls the AI service, and structures the HTTP response.
 */
const generateMessage = async (req, res) => {
    try {
        const data = req.body;
        
        // Input Validation: Check for mandatory fields before calling the costly AI service
        if (!data.intent || !data.targetBio || !data.userSkill) {
            return res.status(400).json({ 
                success: false, 
                error: "Missing required inputs: Connection Goal (intent), Target Bio, or User Skill." 
            });
        }

        // Call the service layer to interact with the Gemini API
        const result = await generateMessageAndFeedback(data);

        // Send the AI message and the structured Mode A feedback back to the frontend
        return res.status(200).json({
            success: true,
            message: result.message,
            feedback: result.feedback
        });

    } catch (error) {
        console.error('Error generating AI message:', error);
        // Provide a user-friendly error response
        return res.status(500).json({ 
            success: false, 
            error: error.message || 'Internal server error during message generation.' 
        });
    }
};

// Export the controller function(s)
export default {
    generateMessage,
    // Placeholder for other controller methods (e.g., handleFeedback for Mode B)
};