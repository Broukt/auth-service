const AppError = require("../utils/appError");
module.exports = function extractToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return next(new AppError("No token provided", 401));
  }
  req.token = auth.split(" ")[1];
  next();
};
