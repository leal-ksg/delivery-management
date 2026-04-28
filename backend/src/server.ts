import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/prisma";
import cors from "cors";
import { router } from "./routes";
import { withRetry } from "./core/with-retry";

async function main() {
  dotenv.config();

  await withRetry(connectDb);

  const PORT = process.env.PORT || 3001;

  const server = express();

  server.use(
    cors({
      origin: [
        "http://192.168.1.65:3000",
        "https://kairos-handmade-mu.vercel.app",
      ],
      credentials: true,
    }),
  );

  server.use(express.json());
  server.use("/api/v1", router);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
  });
}

main();
