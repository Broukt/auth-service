const consumerEvent = require("./consumer");

async function initializeConsumers() {
  try {
    for (const consume of Object.values(consumerEvent)) {
      await consume();
    }
    console.log("RabbitMQ consumers initialized successfully.");
  } catch (error) {
    console.error("Error initializing RabbitMQ consumers:", error);
  }
}

module.exports = initializeConsumers;
