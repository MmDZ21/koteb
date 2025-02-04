// types/next-auth.d.ts
import { User } from "@prisma/client";
import "next-auth";
import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & User

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "USER" | "ADMIN";
  }
}
