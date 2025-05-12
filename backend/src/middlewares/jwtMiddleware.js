const jwt = require('jsonwebtoken');
require('dotenv').config(); 

// Use environment variable or fallback secret
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token from cookies
function verifyToken(req, res, next) {
  
  console.log("req",req.cookies)

  const token = req.cookies?.auth_token;

  console.log("token",token,"JWT", JWT_SECRET)

  if (!token) {
    console.log("No token provided");
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  // Debug log
  console.log("Verifying token with secret:", JWT_SECRET);

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    // Attach decoded user to request for downstream use
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  });
}

module.exports = verifyToken;
