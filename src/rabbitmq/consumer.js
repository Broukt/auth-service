const prisma = require("../database/prisma");
const { connectRabbit } = require("./connection");
const {
  userCreatedQueueAuth,
  userUpdatedQueue,
  userDeletedQueueAuth,
} = require("../config/env");

async function consumeUserEvents() {
  const ch = await connectRabbit();
  await ch.assertQueue(userCreatedQueueAuth, { durable: true });
  await ch.assertQueue(userUpdatedQueue, { durable: true });
  await ch.assertQueue(userDeletedQueueAuth, { durable: true });

  ch.consume(userCreatedQueueAuth, async (msg) => {
    try {
      const { id, name, lastName, email, password, roleId } = JSON.parse(
        msg.content.toString()
      );
      await prisma.user.create({
        data: { id, name, lastName, email, password, roleId },
      });
      ch.ack(msg);
    } catch (err) {
      console.error("Error processing user.created.auth:", err);
      ch.nack(msg, false, false);
    }
  });

  ch.consume(userUpdatedQueue, async (msg) => {
    try {
      const { id, email } = JSON.parse(msg.content.toString());
      await prisma.user.update({ where: { id }, data: { email } });
      ch.ack(msg);
    } catch (err) {
      console.error("Error processing user.updated:", err);
      ch.nack(msg, false, false);
    }
  });

  ch.consume(userDeletedQueueAuth, async (msg) => {
    try {
      const { id } = JSON.parse(msg.content.toString());
      await prisma.user.delete({
        where: { id },
      });
      ch.ack(msg);
    } catch (err) {
      console.error("Error processing user.deleted:", err);
      ch.nack(msg, false, false);
    }
  });
}

module.exports = { consumeUserEvents };
