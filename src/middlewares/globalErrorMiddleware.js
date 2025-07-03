const { env } = require("../config/env");

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    msg: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    // Errores controlados
    res.status(err.statusCode).json({
      status: err.status,
      msg: err.message,
    });
  } else {
    // Errores desconocidos: sólo mensaje genérico y log en servidor
    res.status(500).json({
      status: "error",
      msg: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  // Valores por defecto
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (env === "development") {
    sendErrorDev(err, req, res);
  } else {
    // Clonamos para no mutar el error original
    const error = { ...err };
    error.message = err.message;

    sendErrorProd(error, req, res);
  }
};
