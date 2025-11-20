import { PrismaClient } from "../../generated/prisma";

export const prisma = new PrismaClient({
  transactionOptions: {
    maxWait: 5000,
    timeout: 15000,
  },
});

export async function connectDb() {
  try {
    await prisma.$connect()

    console.log("Postgres successfully connected! 🐘");
  } catch (err) {
    console.log("Error on database connection:", err);
  }
}
