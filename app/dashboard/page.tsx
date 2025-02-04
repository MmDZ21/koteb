import { auth, signOut } from "@/auth";
import React from "react";

export default async function dashboard() {
  const session = await auth();
  return <div>{JSON.stringify(session?.user)}
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">Sign Out</button>
    </form></div>;
}
