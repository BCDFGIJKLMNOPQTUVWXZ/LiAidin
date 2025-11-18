// src/routes/aiRoutes.js

import express from 'express';
// Note: We use .default because aiController exports an object with functions
import aiController from '../controllers/ai.controller.js'; 
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * POST /api/generate-message
 * Route to trigger the AI message generation based on user inputs.
 */
router.post('/generate-message', verifyJWT, aiController.generateMessage);

// Export the router to be used by the main application file (app.js/index.js)
export default router;