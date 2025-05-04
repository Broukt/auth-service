const amqp = require('amqplib');
const { rabbitUrl } = require('../config/env');
console.log("Connecting to RabbitMQ at:", rabbitUrl);

let channel;

async function connectRabbit() {
  if (channel) return channel;
  const connection = await amqp.connect(rabbitUrl);
  channel = await connection.createChannel();
  return channel;
}

module.exports = { connectRabbit };