import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "manager", "user"]),
  phone: z.string().optional(),
  department: z.string().optional(),
  isActive: z.boolean().default(true),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["active", "inactive", "deprecated"]),
  icon: z.string().optional(),
});

export const requestSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  serviceId: z.string().min(1, "Service is required"),
  amount: z.coerce.number().min(0, "Amount must be a positive number"),
  notes: z.string().optional(),
});

export const requestUpdateSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "in_progress", "completed"]),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});

export const paymentSchema = z.object({
  requestId: z.string().min(1, "Request is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  method: z.enum(["credit_card", "bank_transfer", "cash", "online"]),
  transactionId: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  department: z.string().optional(),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type RequestFormData = z.infer<typeof requestSchema>;
export type RequestUpdateFormData = z.infer<typeof requestUpdateSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
