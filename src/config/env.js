require("dotenv").config();
module.exports = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  rabbitUrl: process.env.RABBITMQ_URL || "amqp://localhost:5672",
  userCreatedQueue: process.env.USER_CREATED_QUEUE || "user.created",
};
