import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Use CORS_ORIGIN from environment variables for security
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

// Standard Express Middleware
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// --- Routes Import ---
// Import your user routes (Authentication/Authorization)
import authRoutes from './src/routes/auth.routes.js';
import aiRoutes from './src/routes/ai.routes.js';



// --- Routes Declaration ---
// Prefix all user/auth routes with /api/v1/auth
app.use("/api/v1/auth", authRoutes)

// The full path to the message generator will be: /api/v1/ai/generate-message
app.use("/api/v1/ai", aiRoutes)

export default app;