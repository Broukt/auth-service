const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("../config/env");

const signToken = (userId, userEmail, role) =>
  jwt.sign({ userId, userEmail, role }, jwtSecret, { expiresIn: jwtExpiresIn });

const verifyToken = (token) => jwt.verify(token, jwtSecret);

const getRoleFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null; // No token provided
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token);
    return payload.role; // Return the role from the token payload
  } catch (err) {
    return null; // Token is invalid or expired
  }
};

module.exports = {
  signToken,
  verifyToken,
  getRoleFromHeader,
};
