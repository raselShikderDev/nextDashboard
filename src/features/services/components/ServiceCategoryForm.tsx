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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceCategory } from "@/types/service.types";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
  description: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.coerce.number().min(0).default(0),
});

export type ServiceCategoryFormData = z.infer<typeof categorySchema>;

interface ServiceCategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ServiceCategoryFormData) => void;
  defaultValues?: Partial<ServiceCategory>;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

const ICON_OPTIONS = [
  { value: "graduation-cap", label: "Graduation Cap" },
  { value: "briefcase", label: "Briefcase" },
  { value: "globe", label: "Globe" },
  { value: "plane", label: "Plane" },
  { value: "book-open", label: "Book Open" },
  { value: "file-text", label: "File Text" },
  { value: "tag", label: "Tag" },
  { value: "hash", label: "Hash" },
];

export function ServiceCategoryForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading,
  mode = "create",
}: ServiceCategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceCategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      icon: "graduation-cap",
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name ?? "",
        slug: defaultValues?.slug ?? "",
        // FIX: Convert null to undefined using ?? undefined
        description: defaultValues?.description ?? undefined,
        icon: defaultValues?.icon ?? "graduation-cap",
        sortOrder: defaultValues?.sortOrder ?? 0,
      });
    }
  }, [open, defaultValues, reset]);

  const selectedIcon = watch("icon");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>
        {/* FIX: Wrap handleSubmit with explicit typing */}
        <form
          onSubmit={handleSubmit((data) => onSubmit(data))}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Study Abroad"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="e.g. study-abroad"
              {...register("slug")}
            />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description..."
              rows={3}
              {...register("description")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="icon">Icon</Label>
            <Select
              value={selectedIcon}
              onValueChange={(v) => setValue("icon", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              min={0}
              {...register("sortOrder", { valueAsNumber: true })}
            />
            {errors.sortOrder && (
              <p className="text-xs text-destructive">
                {errors.sortOrder.message}
              </p>
            )}
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