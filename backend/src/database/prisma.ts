import { PrismaClient } from "../../generated/prisma";

export const prisma = new PrismaClient({
  transactionOptions: {
    maxWait: 10000,
    timeout: 30000,
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
