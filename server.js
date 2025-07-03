const buildApp = require("./src/app");
const config = require("./src/config/env");

const PORT = config.port || process.env.PORT || 3000;

async function main() {
  const app = await buildApp();
  app
    .listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${config.env}`);
    })
    .on("error", (err) => {
      console.error("Error starting server:", err);
      process.exit(1);
    });
}

main().catch((err) => {
  console.error("Failed to bootstrap app:", err);
  process.exit(1);
});
