import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/prisma";
import cors from "cors";
import { router } from "./routes";
import { withRetry } from "./core/with-retry";

async function main() {
  try {
    dotenv.config();

    await withRetry(connectDb);

    const PORT = process.env.PORT || 3001;

    const server = express();

    // TODO: add cors config
    server.use(cors());
    server.use(express.json());
    server.use("/api/v1", router);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} 🚀`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

main();
