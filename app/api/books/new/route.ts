import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createBookSchema } from "@/lib/zod";
import { z } from "zod";

export async function POST(req: Request) {
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
