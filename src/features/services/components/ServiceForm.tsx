import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { serviceSchema, type ServiceFormData } from "../../../lib/validators";
import { Service, ServiceCategory } from "@/types/service.types";

const CATEGORIES = [
  "Development",
  "Design",
  "Analytics",
  "Infrastructure",
  "Support",
  "Consulting",
  "Marketing",
  "Security",
];

interface ServiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  defaultValues?: Service;
  isLoading?: boolean;
  mode?: "create" | "edit";
  serviceCategory:ServiceCategory[] | null
}

export function ServiceForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading,
  mode = "create",
  serviceCategory
}: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      category: defaultValues?.category ?? "",
      status: defaultValues?.status ?? "active",
      icon: defaultValues?.icon ?? "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name,
        description: defaultValues.description,
        price: defaultValues.price,
        category: defaultValues.category,
        status: defaultValues.status,
        icon: defaultValues.icon ?? "",
      });
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        category: "",
        status: "active",
        icon: "",
      });
    }
  }, [defaultValues, reset]);

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "New Service" : "Edit Service"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Service Name</Label>
            <Input placeholder="e.g. Web Development" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              placeholder="Describe the service..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-xs text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(v) =>
                  setValue("status", v as ServiceFormData["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={watch("category")}
              onValueChange={(v) => setValue("category", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Icon (emoji or URL)</Label>
            <Input placeholder="💻 or https://..." {...register("icon")} />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create Service" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
