import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// -------- CORS FIX --------
const allowedOrigins = [
  "http://localhost:5173",
  "https://zippy-cupcake-548f72.netlify.app",
  "https://*.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(o =>
      o === origin || (o.includes("*") && origin.endsWith(".netlify.app"))
    );

    if (isAllowed) callback(null, true);
    else callback(new Error("CORS Not Allowed: " + origin));
  },
  credentials: true,
}));
// --------------------------

// Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import authRoutes from './src/routes/auth.routes.js';
import aiRoutes from './src/routes/ai.routes.js';

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/ai", aiRoutes);

export default app;
