const bcrypt = require("bcrypt");
const prisma = require("../database/prisma");
const { connectRabbit } = require("./connection");
const { userCreatedQueue } = require("../config/env");

async function consumeUserCreated() {
  const ch = await connectRabbit();
  await ch.assertQueue(userCreatedQueue, { durable: true });
  ch.consume(userCreatedQueue, async (msg) => {
    try {
      const { id, email, password } = JSON.parse(msg.content.toString());
      if (!id || !email || !password) {
        console.error("Invalid message format:", msg.content.toString());
        return ch.ack(msg);
      }
      let exists = await prisma.authUser.findUnique({ where: { id } });
      if (exists) {
        console.log("User already exists:", id);
        return ch.ack(msg);
      }
      exists = await prisma.authUser.findUnique({ where: { email } });
      if (!exists) {
        const hashed = await bcrypt.hash(password, 12);
        await prisma.authUser.create({ data: { id, email, password: hashed } });
      }
      ch.ack(msg);
    } catch (err) {
      console.error("Failed to process user.created:", err);
      ch.nack(msg, false, false);
    }
  });
}

module.exports = { consumeUserCreated };
