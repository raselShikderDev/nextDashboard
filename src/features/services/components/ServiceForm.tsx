import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ServiceFormData) => void;
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
    },
  });

  const { data: categoriesData } = useGetAllServiceCategoriesQuery();
  const categories = categoriesData?.data ?? [];

  const selectedCategoryId = watch("categoryId");
  const isActive = watch("isActive");
  const requiresQuotation = watch("requiresQuotation");

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
      });
    }
  }, [open, defaultValues, reset]);

  const handleFeaturesChange = (value: string) => {
    const updated = value.split(",").map((f) => f.trim()).filter(Boolean);
    setValue("features", updated);
  };

  const handleDeliverablesChange = (value: string) => {
    const updated = value.split(",").map((d) => d.trim()).filter(Boolean);
    setValue("deliverables", updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Service" : "Edit Service"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) => onSubmit(data))}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Germany SOP Writing"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Service description..."
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min={0}
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price.message}</p>
              )}
            </div>
            {/* FIX: Ensure Select has proper Content wrapper */}
            <div className="space-y-1.5">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={watch("currency")}
                onValueChange={(v) => setValue("currency", v)}
              >
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

          {/* FIX: Ensure Select has proper Content wrapper */}
          <div className="space-y-1.5">
            <Label htmlFor="categoryId">Category</Label>
            <Select
              value={selectedCategoryId}
              onValueChange={(v) => setValue("categoryId", v)}
            >
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="" disabled>
                    No categories available
                  </SelectItem>
                ) : (
                  categories.map((cat: { id: string; name: string }) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="turnaround">Turnaround</Label>
            <Input
              id="turnaround"
              placeholder="e.g. 3-5 business days"
              {...register("turnaround")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Input
              id="features"
              placeholder="Feature 1, Feature 2, Feature 3"
              defaultValue={watch("features")?.join(", ")}
              onChange={(e) => handleFeaturesChange(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deliverables">Deliverables (comma-separated)</Label>
            <Input
              id="deliverables"
              placeholder="Deliverable 1, Deliverable 2"
              defaultValue={watch("deliverables")?.join(", ")}
              onChange={(e) => handleDeliverablesChange(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="requiresQuotation"
                checked={requiresQuotation}
                onCheckedChange={(checked: boolean | "indeterminate") =>
                  setValue("requiresQuotation", checked === true)
                }
              />
              <Label htmlFor="requiresQuotation" className="text-sm font-normal">
                Requires Quotation
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked: boolean | "indeterminate") =>
                  setValue("isActive", checked === true)
                }
              />
              <Label htmlFor="isActive" className="text-sm font-normal">
                Active
              </Label>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              min={0}
              {...register("sortOrder", { valueAsNumber: true })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create"
                  : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}