import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function connectDb() {
  try {
    await prisma.$connect();

    console.log("Postgres successfully connected! 🐘");
  } catch (err) {
    console.log("Error on database connection:", err);
  }
}
