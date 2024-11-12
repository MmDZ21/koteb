import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createOrderSchema } from "@/lib/zod";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = await req.json();
    const parsedData = createOrderSchema.parse(data);

    const book = await prisma.book.findUnique({
      where: { id: parsedData.bookId },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const totalPrice = book.price * parsedData.quantity;

    const order = await prisma.order.create({
      data: {
        buyerId: user.id,
        bookId: parsedData.bookId,
        quantity: parsedData.quantity,
        totalPrice,
      },
    });

    return NextResponse.json(order, { status: 201 });
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { buyerId: user.id },
    include: { book: true },
  });

  return NextResponse.json(orders);
}
