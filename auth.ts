import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/utils/password";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { ExtendedUser } from "./types/types";



export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          // Look up the user in the database
          const user = await prisma.user.findUnique({
            where: { email },
          });

          // If no user is found or the password is incorrect, return null
          if (!user) {
            console.error("User not found");
            return null;
          }

          const isPasswordValid = await verifyPassword(password, user.password);
          if (!isPasswordValid) {
            console.error("Invalid password");
            return null;
          }

          // Return the user object if valid
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Validation error:", error.errors);
            return null;
          }

          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        console.log("User in jwt callback:", user); // Add this line
        token.user = user;
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user as ExtendedUser;
      return session;
    },
  },
});
