import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./core/prisma";

async function main () {
  dotenv.config();
  await connectDb()

  const PORT = process.env.PORT || 3001;

  const server = express();

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
  });
}

main()