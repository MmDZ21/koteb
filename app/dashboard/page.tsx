import { auth } from "@/auth";
import React from "react";

export default async function dashboard() {
  const session = await auth();
  return <div>{session?.user.role}</div>;
}
