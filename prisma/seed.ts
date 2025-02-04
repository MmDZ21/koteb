import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { saltAndHashPassword } from "../utils/password";

async function main() {
  const hashedPassword = await saltAndHashPassword("examplePassword123");
  const user = await prisma.user.create({
    data: {
      name: "Example User",
      email: "example@example.com",
      password: hashedPassword,
      verified: true, // Set to true for testing purposes
    },
  });
  console.log("User created:", user);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
