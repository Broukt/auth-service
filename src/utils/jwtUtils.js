const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("../config/env");

const signToken = (id) =>
  jwt.sign({ id }, jwtSecret, { expiresIn: jwtExpiresIn });

const verifyToken = (token) => jwt.verify(token, jwtSecret);

module.exports = {
  signToken,
  verifyToken,
};
