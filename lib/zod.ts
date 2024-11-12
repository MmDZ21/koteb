import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});
export const createBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  condition: z.enum(["NEW", "GOOD", "FAIR", "POOR"]),
  price: z.number().positive(),
  isbn: z.string().min(10).max(13),
  sellerId: z.string().uuid(),
});

export const updateBookSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  condition: z.enum(["NEW", "GOOD", "FAIR", "POOR"]).optional(),
  price: z.number().positive().optional(),
  isbn: z.string().min(10).max(13).optional(),
});

export const createOrderSchema = z.object({
  bookId: z.string().uuid(),
  quantity: z.number().positive(),
});
export const updateOrderSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "CANCELED"]),
});
