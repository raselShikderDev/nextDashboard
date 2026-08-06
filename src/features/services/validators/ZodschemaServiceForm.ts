import z from "zod";

// Zod schema for the service form
export const serviceSchema = z.object({
  name: z.string().min(10),
  price: z.coerce.number().min(0),
  categoryId: z.string().min(1),
  features: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  turnaround: z.string().optional(),
  currency: z.string().default("BDT"),
  requiresQuotation: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
  formSchema: z.array(
    z.object({
      name: z.string().min(1, "Field key is required"),
      label: z.string().min(1, "Label is required"),
      type: z.enum(["text", "number", "select", "textarea", "date", "email", "file"]),
      required: z.boolean().default(false),
      placeholder: z.string().optional(),
      options: z.array(z.string()).optional(),
    })
  ).default([]),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;