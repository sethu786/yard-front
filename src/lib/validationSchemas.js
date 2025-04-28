import { z } from "zod";

export const transactionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number({ invalid_type_error: "Amount must be a number" }).positive("Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  categoryId: z.string().min(1, "Category is required"),
});

export const budgetSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  amount: z.number({ invalid_type_error: "Amount must be a number" }).positive("Amount must be positive"),
});
