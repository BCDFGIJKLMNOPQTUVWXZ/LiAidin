import { verifyAccessToken } from "../services/token.service.js";

// Middleware to verify JWT and attach user data to the request
export const verifyJWT = (req, res, next) => {
    // 1. Get token from the Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized: Missing or invalid token format" });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify the token signature and expiration
        console.log("Incoming Token:", token);
        const decodedToken = verifyAccessToken(token);
        console.log("Decoded:", decodedToken);
        
        // 3. Attach decoded payload (id, email, role) to the request object
        // This makes user data available in all subsequent controllers
        req.user = decodedToken; 
        
        next(); 

    } catch (error) {
        console.error("JWT Verification Failed:", error.message);
        // Token is invalid (expired, wrong signature, etc.)
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};

// Middleware to check if the user has the required role(s) (for RBAC)
export const checkRole  = (roles) => {
    return (req, res, next) => {
        // req.user must be set by verifyJWT first!
        if (!req.user || !roles.includes(req.user.role)) {
            // Log the denied attempt
            console.warn(`Access Denied: User ${req.user ? req.user.email : 'Unknown'} tried to access restricted route.`);
            return res.status(403).json({ message: "Access Denied: Insufficient privileges" });
        }
        next();
    };
};