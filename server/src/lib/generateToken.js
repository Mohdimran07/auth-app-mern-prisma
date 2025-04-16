// Import the jsonwebtoken library to handle JWT creation and verification
import jwt from "jsonwebtoken";

/**
 * Generates a JWT token for the given user and sets it as a cookie in the response.
 * 
 * @param {Object} user - The user object containing user details (e.g., _id, role).
 * @param {Object} res - The response object to set the cookie.
 */
const generateToken = (user, res) => {
  // Generate a JWT token with the user's ID and role as payload
  const token = jwt.sign(
    { id: user.id, role: user.role }, // Payload containing user ID and role
    process.env.JWT_SECRET,           // Secret key for signing the token
    { expiresIn: "3d" }               // Token expiration time (3 days)
  );

  // Set the generated token as a cookie in the response
  res.cookie("token", token, {
    httpOnly: true,                                             // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'Production',              // Ensures the cookie is sent over HTTPS only
    sameSite: "strict",                                         // Restricts the cookie to same-site requests
    maxAge: 3 * 24 * 60 * 60 * 1000,                            // Cookie expiration time (3 days in milliseconds)
  });
};

// Export the function for use in other parts of the application
export default generateToken;
