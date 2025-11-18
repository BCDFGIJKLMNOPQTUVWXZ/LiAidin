import express from 'express';
import { 
    registerUser, 
    loginUser, 
    getProfile, 
    logoutUser, 
    refreshAccessToken
} from '../controllers/auth.controller.js';
// We are using the exported middleware functions directly
import { verifyJWT, checkRole } from '../middlewares/auth.middleware.js'; 

const router = express.Router();

// --- Public Routes (No authentication required) ---
// POST /api/v1/auth/signup: Creates a user, hashes password, returns JWTs.
router.post('/signup', registerUser);

// POST /api/v1/auth/login: Authenticates user, issues JWTs.
router.post('/login', loginUser);

// POST /api/v1/auth/refresh: Renews the access token using the refresh token.
router.post('/refresh', refreshAccessToken); 


// --- Protected Routes (Require a valid Access Token) ---

// GET /api/v1/auth/profile: Retrieves the current user's data from the token payload.
// Uses verifyJWT to ensure the user is authenticated.
router.get('/profile', verifyJWT, getProfile);

// POST /api/v1/auth/logout: Revokes the refresh token in the database.
// Uses verifyJWT to identify the user before revocation.
router.post('/logout', verifyJWT, logoutUser); 


// --- Admin Protected Route (RBAC Enforcement) ---
// GET /api/v1/auth/admin-check: Checks if the user is both authenticated AND an 'admin'.
router.get('/admin-check', verifyJWT, checkRole(['admin']), (req, res) => {
    res.status(200).json({ message: "Welcome, Admin! Your privileges are confirmed." });
});

export default router;