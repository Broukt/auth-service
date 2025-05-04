const AppError = require("../utils/appError");
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.isOperational ? "fail" : "error";
  const msg = err.isOperational ? err.message : "Internal server error";
  res.status(err.statusCode).json({ status: err.status, message: msg });
};
