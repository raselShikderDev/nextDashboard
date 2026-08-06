import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Service } from "@/types/service.types";
import { useGetAllServiceCategoriesQuery } from "../api/serviceCategoryApi";

const FIELD_TYPES = [
  { value: "TEXT", label: "Text" },
  { value: "TEXTAREA", label: "Textarea" },
  { value: "NUMBER", label: "Number" },
  { value: "EMAIL", label: "Email" },
  { value: "PHONE", label: "Phone" },
  { value: "PASSWORD", label: "Password" },
  { value: "DATE", label: "Date" },
  { value: "FILE", label: "File Upload" },
  { value: "SELECT", label: "Dropdown" },
  { value: "MULTI_SELECT", label: "Multi Select" },
  { value: "RADIO", label: "Radio" },
  { value: "CHECKBOX", label: "Checkbox" },
  { value: "URL", label: "URL" },
];

const formFieldSchema = z.object({
  name: z.string().min(1, "Field key is required"),
  label: z.string().min(1, "Label is required"),
  type: z.enum([
    "TEXT",
    "TEXTAREA",
    "NUMBER",
    "EMAIL",
    "PHONE",
    "PASSWORD",
    "DATE",
    "FILE",
    "SELECT",
    "MULTI_SELECT",
    "RADIO",
    "CHECKBOX",
    "URL",
  ]),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
});

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  currency: z.string().default("BDT"),
  categoryId: z.string().min(1, "Category is required"),
  features: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  turnaround: z.string().optional(),
  requiresQuotation: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().min(0).default(0),
  slug: z.string().optional(),
  formSchema: z.array(formFieldSchema).default([]), 
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  defaultValues?: Partial<Service>;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export function ServiceForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading,
  mode = "create",
}: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      currency: "BDT",
      categoryId: "",
      features: [],
      deliverables: [],
      turnaround: "",
      requiresQuotation: false,
      isActive: true,
      sortOrder: 0,
      formSchema: [], 
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "formSchema",
  });

  const { data: categoriesData } = useGetAllServiceCategoriesQuery();
  const categories = categoriesData?.data ?? [];

  const selectedCategoryId = watch("categoryId");
  const isActive = watch("isActive");
  const requiresQuotation = watch("requiresQuotation");
  const features = watch("features");
  const deliverables = watch("deliverables");

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name ?? "",
        description: defaultValues?.description ?? "",
        price: defaultValues?.price ? Number(defaultValues.price) : 0,
        currency: defaultValues?.currency ?? "BDT",
        categoryId: defaultValues?.categoryId ?? "",
        features: defaultValues?.features ?? [],
        deliverables: defaultValues?.deliverables ?? [],
        turnaround: defaultValues?.turnaround ?? "",
        requiresQuotation: defaultValues?.requiresQuotation ?? false,
        isActive: defaultValues?.isActive ?? true,
        sortOrder: defaultValues?.sortOrder ?? 0,
        formSchema: (defaultValues?.formSchema as ServiceFormData["formSchema"]) ?? [],
      });
    }
  }, [open, defaultValues, reset]);

  const handleFormSubmit = async (data: ServiceFormData) => {
    try {
      await onSubmit(data);
      reset({
        name: defaultValues?.name ?? "",
        description: defaultValues?.description ?? "",
        price: defaultValues?.price ? Number(defaultValues.price) : 0,
        currency: defaultValues?.currency ?? "BDT",
        categoryId: defaultValues?.categoryId ?? "",
        features: defaultValues?.features ?? [],
        deliverables: defaultValues?.deliverables ?? [],
        turnaround: defaultValues?.turnaround ?? "",
        requiresQuotation: defaultValues?.requiresQuotation ?? false,
        isActive: defaultValues?.isActive ?? true,
        sortOrder: defaultValues?.sortOrder ?? 0,
        formSchema: (defaultValues?.formSchema as ServiceFormData["formSchema"]) ?? [],
      });
    } catch (error) {
      reset({
        name: defaultValues?.name ?? "",
        description: defaultValues?.description ?? "",
        price: defaultValues?.price ? Number(defaultValues.price) : 0,
        currency: defaultValues?.currency ?? "BDT",
        categoryId: defaultValues?.categoryId ?? "",
        features: defaultValues?.features ?? [],
        deliverables: defaultValues?.deliverables ?? [],
        turnaround: defaultValues?.turnaround ?? "",
        requiresQuotation: defaultValues?.requiresQuotation ?? false,
        isActive: defaultValues?.isActive ?? true,
        sortOrder: defaultValues?.sortOrder ?? 0,
        formSchema: (defaultValues?.formSchema as ServiceFormData["formSchema"]) ?? [],
      });
    }
  };

  const addFormField = () => {
    append({ name: "", label: "", type: "TEXT", required: false, placeholder: "", options: [] });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Service" : "Edit Service"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="e.g. Germany SOP Writing" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Service description..." rows={3} {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" min={0} {...register("price", { valueAsNumber: true })} />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currency">Currency</Label>
              <Select value={watch("currency")} onValueChange={(v) => setValue("currency", v)}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BDT">BDT</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="categoryId">Category</Label>
            <Select value={selectedCategoryId} onValueChange={(v) => setValue("categoryId", v)}>
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="" disabled>No categories available</SelectItem>
                ) : (
                  categories.map((cat: { id: string; name: string }) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
          </div>

          {/* Turnaround */}
          <div className="space-y-1.5">
            <Label htmlFor="turnaround">Turnaround</Label>
            <Input id="turnaround" placeholder="e.g. 3-5 business days" {...register("turnaround")} />
          </div>

          {/* Features */}
          <div className="space-y-1.5">
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Input
              id="features"
              placeholder="Feature 1, Feature 2, Feature 3"
              value={features?.join(", ") ?? ""}
              onChange={(e) =>
                setValue("features", e.target.value.split(",").map((f) => f.trim()).filter(Boolean), {
                  shouldDirty: true,
                })
              }
            />
          </div>

          {/* Deliverables */}
          <div className="space-y-1.5">
            <Label htmlFor="deliverables">Deliverables (comma-separated)</Label>
            <Input
              id="deliverables"
              placeholder="Deliverable 1, Deliverable 2"
              value={deliverables?.join(", ") ?? ""}
              onChange={(e) =>
                setValue("deliverables", e.target.value.split(",").map((d) => d.trim()).filter(Boolean), {
                  shouldDirty: true,
                })
              }
            />
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="requiresQuotation"
                checked={requiresQuotation}
                onCheckedChange={(checked) => setValue("requiresQuotation", checked === true)}
              />
              <Label htmlFor="requiresQuotation" className="text-sm font-normal">Requires Quotation</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", checked === true)}
              />
              <Label htmlFor="isActive" className="text-sm font-normal">Active</Label>
            </div>
          </div>

          {/* Sort Order */}
          <div className="space-y-1.5">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input id="sortOrder" type="number" min={0} {...register("sortOrder", { valueAsNumber: true })} />
          </div>

          {/* Form Schema Builder */}
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Service Form Fields</Label>
              <Button type="button" variant="outline" size="sm" onClick={addFormField}>
                <Plus className="w-4 h-4 mr-1" /> Add Field
              </Button>
            </div>

            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No custom fields. Users will submit basic info only.
              </p>
            )}

            <div className="space-y-3">
              {fields.map((field, index) => {
                const fieldType = watch(`formSchema.${index}.type`);
                const options = watch(`formSchema.${index}.options`) || [];

                return (
                  <div key={field.id} className="border rounded-md p-3 space-y-3 bg-background">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Field Key</Label>
                          <Input placeholder="e.g. passportNumber" {...register(`formSchema.${index}.name`)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Label</Label>
                          <Input placeholder="e.g. Passport Number" {...register(`formSchema.${index}.label`)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={fieldType}
                            onValueChange={(v) => setValue(`formSchema.${index}.type`, v as any, { shouldDirty: true })}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {FIELD_TYPES.map((t) => (
                                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Placeholder</Label>
                          <Input placeholder="Enter value..." {...register(`formSchema.${index}.placeholder`)} />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive mt-5"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {fieldType === "SELECT" && (
                      <div className="space-y-1">
                        <Label className="text-xs">Options (comma-separated)</Label>
                        <Input
                          placeholder="Option 1, Option 2, Option 3"
                          value={options.join(", ")}
                          onChange={(e) =>
                            setValue(
                              `formSchema.${index}.options`,
                              e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                              { shouldDirty: true }
                            )
                          }
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={watch(`formSchema.${index}.required`)}
                        onCheckedChange={(v) => setValue(`formSchema.${index}.required`, v === true, { shouldDirty: true })}
                      />
                      <Label className="text-xs cursor-pointer">Required field</Label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (mode === "create" ? "Creating..." : "Saving...") : mode === "create" ? "Create" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}