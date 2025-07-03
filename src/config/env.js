require("dotenv").config();
module.exports = {
  port: process.env.PORT || 4000,
  env: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  rabbitUrl: process.env.RABBITMQ_URL || "amqp://localhost",
  userCreatedQueueAuth:
    process.env.USER_CREATED_QUEUE_AUTH || "user.created.auth",
  userUpdatedQueue: process.env.USER_UPDATED_QUEUE || "user.updated",
  userDeletedQueueAuth:
    process.env.USER_DELETED_QUEUE_AUTH || "user.deleted.auth",
};