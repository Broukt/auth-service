const express = require("express");
const authRoutes = require("./routes/authRoutes");
const globalErrorMiddleware = require("./middlewares/globalErrorMiddleware");
const prisma = require("./database/prisma");
const initializeConsumers = require("./rabbitmq/initialize");

async function buildApp() {
  const app = express();

  app.use(express.json());
  app.use("/", authRoutes);
  app.use(globalErrorMiddleware);

  await prisma.$connect();
  await initializeConsumers();
  return app;
}

module.exports = buildApp;
