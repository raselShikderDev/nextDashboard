import { Role } from "@/types/enums";
import z from "zod";

export const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.nativeEnum(Role),
});

export type StaffFormData = z.infer<typeof staffSchema>;