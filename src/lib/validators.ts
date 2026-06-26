import { z } from "zod";

import { GuestSource, PaymentMethod, PaymentStatus, RequestStatus, Role } from "@/types/enums";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.nativeEnum(Role),
  phone: z.string().optional(),
  department: z.string().optional(),
  isActive: z.boolean().default(true),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  price: z.coerce
    .number()
    .min(0, "Price must be greater than or equal to 0"),

  categoryId: z.string().min(1, "Category is required"),

  features: z.array(z.string()).default([]),

  deliverables: z.array(z.string()).default([]),

  turnaround: z.string().optional(),

  currency: z.string().default("BDT"),

  requiresQuotation: z.boolean().default(false),

  isActive: z.boolean().default(true),

  sortOrder: z.coerce.number().default(0),
});

export const requestSchema = z.object({
  guestName: z
    .string()
    .min(2, "Guest name must be at least 2 characters"),

  guestEmail: z
    .string()
    .email("Please enter a valid email address"),

  guestPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits"),

  guestAddress: z
    .string()
    .min(3, "Address must be at least 3 characters"),

  guestSource: z
    .nativeEnum(GuestSource)
    .default(GuestSource.WEBSITE),

  serviceId: z
    .string()
    .min(1, "Service is required"),

  userNotes: z
    .string()
    .optional(),

  formData: z
    .record(z.any())
    .optional(),
});

export const requestUpdateSchema = z.object({
  status: z.nativeEnum(RequestStatus),

  assignedToId: z
    .string()
    .optional(),

  adminNotes: z
    .string()
    .optional(),

  quotedPrice: z.coerce
    .number()
    .optional(),

  finalPrice: z.coerce
    .number()
    .optional(),

  deliveryMessage: z
    .string()
    .optional(),

  dueDate: z
    .string()
    .optional(),
});

export const paymentSchema = z.object({
  requestId: z
    .string()
    .min(1, "Request is required"),

  amount: z.coerce
    .number()
    .min(1, "Amount must be greater than 0"),

  method: z.nativeEnum(PaymentMethod),

  transactionId: z
    .string()
    .min(1, "Transaction ID is required"),

  senderNumber: z
    .string()
    .optional(),

  userNote: z
    .string()
    .optional(),

  screenshotUrl: z
    .string()
    .optional(),

  status: z
    .nativeEnum(PaymentStatus)
    .default(PaymentStatus.SUBMITTED),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  email: z.string().email("Invalid email address"),

  phone: z.string().optional(),

  department: z.string().optional(),
});

export const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type LoginFormData = z.infer<typeof loginSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type RequestFormData = z.infer<typeof requestSchema>;
export type RequestUpdateFormData = z.infer< typeof requestUpdateSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;