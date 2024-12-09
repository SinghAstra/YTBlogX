import { startWorker } from "@/lib/workers/background-worker";

startWorker().catch(console.error);
