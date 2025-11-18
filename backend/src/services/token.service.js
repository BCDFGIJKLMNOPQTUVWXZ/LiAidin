import { database } from '../../db/db.js';
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

// Get the initialized User model
const User = database.User;

//Assign tokens to a user (used during login/register)
export const assignTokens = async (user) => {
  // Pass the full user object, which contains the 'role'
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token in DB for verification and revocation
  await User.update(
      { refreshToken: refreshToken },
      { where: { id: user.id } }
  );

  return { accessToken, refreshToken };
};

//Verify Access Token (used in middleware)
export const verifyAccessToken = (token) => {
    // Use the JWT_SECRET defined in the environment
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

//Verify Refresh Token (more complex—checks signature AND DB for validity)
export const verifyRefreshToken = async (token) => {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
    // Check if the refresh token stored in the DB matches the token provided
    const user = await User.findByPk(decoded.id);
    
    // Check both existence and token match
    if (!user || user.refreshToken !== token) {
        throw new Error("Invalid or revoked refresh token.");
    }
    return user;
};

//Revoke Refresh Token (used in logout route)
export const revokeRefreshToken = async (userId) => {
    await User.update(
        { refreshToken: null },
        { where: { id: userId } }
    );
};
