import { auth } from "@/auth";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const token = await auth(req, res);
  return console.log(token);
}
