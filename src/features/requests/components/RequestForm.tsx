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
import { requestSchema, type RequestFormData } from "../../../lib/validators";
import { ServiceRequest } from "@/types/request.types";

const MOCK_SERVICES = [
  { id: "svc-1", name: "APS Certificate" },
  { id: "svc-2", name: "Germany SOP Writing" },
  { id: "svc-3", name: "Blocked Account" },
  { id: "svc-4", name: "Student Visa" },
  { id: "svc-5", name: "Accommodation" },
];

interface RequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RequestFormData) => Promise<void>;
  defaultValues?: Partial<ServiceRequest>;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export function RequestForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading,
  mode = "create",
}: RequestFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      guestAddress: "",
      serviceId: "",
      userNotes: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      reset({
        guestName: defaultValues.guestName ?? "",
        guestEmail: defaultValues.guestEmail ?? "",
        guestPhone: defaultValues.guestPhone ?? "",
        guestAddress: defaultValues.guestAddress ?? "",
        serviceId: defaultValues.serviceId ?? "",
        userNotes: defaultValues.userNotes ?? "",
      });
    } else {
      reset({
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        guestAddress: "",
        serviceId: "",
        userNotes: "",
      });
    }
  }, [defaultValues, mode, reset]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleFormSubmit = async (data: RequestFormData) => {
    await onSubmit(data);

    if (mode === "create") {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create Request"
              : "Update Request"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Guest Name</Label>
            <Input
              placeholder="Enter guest name"
              {...register("guestName")}
            />
            {errors.guestName && (
              <p className="text-xs text-destructive">
                {errors.guestName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter email"
              {...register("guestEmail")}
            />
            {errors.guestEmail && (
              <p className="text-xs text-destructive">
                {errors.guestEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              placeholder="Enter phone number"
              {...register("guestPhone")}
            />
            {errors.guestPhone && (
              <p className="text-xs text-destructive">
                {errors.guestPhone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              placeholder="Enter address"
              {...register("guestAddress")}
            />
            {errors.guestAddress && (
              <p className="text-xs text-destructive">
                {errors.guestAddress.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Service</Label>

            <Select
              value={watch("serviceId")}
              onValueChange={(value) =>
                setValue("serviceId", value, {
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>

              <SelectContent>
                {MOCK_SERVICES.map((service) => (
                  <SelectItem
                    key={service.id}
                    value={service.id}
                  >
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.serviceId && (
              <p className="text-xs text-destructive">
                {errors.serviceId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>

            <Textarea
              rows={3}
              placeholder="Additional notes"
              {...register("userNotes")}
            />
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

            <Button
              type="submit"
              disabled={
                isLoading ||
                (mode === "edit" && !isDirty)
              }
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {mode === "create"
                ? "Create Request"
                : "Update Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}