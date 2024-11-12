import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateBookSchema } from "@/lib/zod";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  params = await params;
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
    });
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const user = session?.user;
  params = await params;
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const book = await prisma.book.findUnique({ where: { id: params.id } });
  if (!book || book.sellerId !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  try {
    const data = await req.json();
    const parsedData = updateBookSchema.parse(data);

    const updatedBook = await prisma.book.update({
      where: { id: params.id },
      data: parsedData,
    });
    return NextResponse.json(updatedBook);
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const user = session?.user;
  params = await params;
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const book = await prisma.book.findUnique({ where: { id: params.id } });
  if (!book || book.sellerId !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  try {
    await prisma.book.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error fetching books:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
