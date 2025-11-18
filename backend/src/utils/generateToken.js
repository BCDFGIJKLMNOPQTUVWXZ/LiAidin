import jwt from 'jsonwebtoken';

// --- ACCESS TOKEN ---
// Short-lived token for securing API calls
export const generateAccessToken = (user) => {
    // The user object MUST contain the role for RBAC
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.role 
        },
        process.env.ACCESS_TOKEN_SECRET, // Using a single secret for simplicity in this MVP
        { 
            expiresIn:  process.env.ACCESS_TOKEN_EXPIRY 
        } 
    );
};

// --- REFRESH TOKEN ---
// Long-lived token for renewing the access token (requires a separate secret in production)
export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET, // Use dedicated secret if available
        { 
            expiresIn:  process.env.REFRESH_TOKEN_EXPIRY 
        } 
    );
};