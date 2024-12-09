import { startWorker } from "../lib/workers/background-worker";

async function main() {
  try {
    console.log("Starting background worker...");
    await startWorker();
  } catch (error) {
    console.error("Worker failed to start:", error);
    process.exit(1);
  }
}

main();
