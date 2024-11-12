import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createBookSchema } from "@/lib/zod";
import { z } from "zod";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const parsedData = createBookSchema.parse(data);

    const book = await prisma.book.create({
      data: parsedData,
    });

    return NextResponse.json(book);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const books = await prisma.book.findMany();
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
