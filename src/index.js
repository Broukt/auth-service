const express = require("express");
const authRoutes = require("./routes/authRoutes");
const globalErrorMiddleware = require("./middlewares/globalErrorMiddleware");
const prisma = require("./database/prisma");
const { port } = require("./config/env");
const { consumeUserCreated } = require("./rabbitmq/consumer");

async function start() {
  const app = express();
  app.use(express.json());
  app.use("/", authRoutes);
  app.use(globalErrorMiddleware);

  await prisma.$connect();
  consumeUserCreated();

  app.listen(port, () => console.log(`Auth Service on port ${port}`));
}

start().catch((err) => {
  console.error("Auth Service failed to start:", err);
  process.exit(1);
});
