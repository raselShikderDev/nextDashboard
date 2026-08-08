import { useEffect, useMemo, useState } from "react";
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
import { useGetAllServicesQuery } from "@/features/services/api/servicesApi";
import { GuestSource, PaymentMethod } from "@/types/enums"; // adjust path if needed
import { Checkbox } from "@/components/ui/checkbox";
import { useAppSelector } from "@/app/hooks";

interface RequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RequestFormData) => Promise<void>;
  defaultValues?: Partial<ServiceRequest>;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

const PAYMENT_METHOD_OPTIONS = [
  { value: PaymentMethod.BKASH, label: "bKash" },
  { value: PaymentMethod.NAGAD, label: "Nagad" },
  { value: PaymentMethod.BANK_TRANSFER, label: "Bank Transfer" },
  // Add more if your enum has others
];

export function RequestForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading,
  mode = "create",
}: RequestFormProps) {
  const { data: servicesData, isLoading: isServicesLoading } =
    useGetAllServicesQuery({});
  const user = useAppSelector((state) => state.auth.user);

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
      guestSource: GuestSource.WEBSITE,
      serviceId: "",
      userNotes: "",
      formData: {},
      paymentMethod: undefined,
      transactionId: undefined,
      senderNumber: undefined,
      paymentNote: undefined,
    },
  });

  const selectedServiceId = watch("serviceId");
  const [includePayment, setIncludePayment] = useState(false);

  const selectedService = useMemo(() => {
    return servicesData?.data?.find((s: any) => s.id === selectedServiceId);
  }, [servicesData, selectedServiceId]);

  const dynamicFields = useMemo(() => {
    if (!selectedService?.formSchema) return [];
    try {
      return typeof selectedService.formSchema === "string"
        ? JSON.parse(selectedService.formSchema)
        : selectedService.formSchema;
    } catch {
      return [];
    }
  }, [selectedService]);

  // Reset payment fields when checkbox is unchecked
  useEffect(() => {
    if (!includePayment) {
      setValue("paymentMethod", undefined, { shouldDirty: true });
      setValue("transactionId", undefined, { shouldDirty: true });
      setValue("senderNumber", undefined, { shouldDirty: true });
      setValue("paymentNote", undefined, { shouldDirty: true });
    }
  }, [includePayment, setValue]);

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      const hasPayment = !!(defaultValues as any)?.paymentMethod;
      setIncludePayment(hasPayment);

      reset({
        guestName: defaultValues.guestName ?? "",
        guestEmail: defaultValues.guestEmail ?? "",
        guestPhone: defaultValues.guestPhone ?? "",
        guestAddress: defaultValues.guestAddress ?? "",
        guestSource:
          (defaultValues.guestSource as GuestSource) ?? GuestSource.WEBSITE,
        serviceId: defaultValues.serviceId ?? "",
        userNotes: defaultValues.userNotes ?? "",
        formData: (defaultValues.formData as Record<string, any>) ?? {},
        paymentMethod: (defaultValues as any)?.paymentMethod ?? undefined,
        transactionId: (defaultValues as any)?.transactionId ?? undefined,
        senderNumber: (defaultValues as any)?.senderNumber ?? undefined,
        paymentNote: (defaultValues as any)?.paymentNote ?? undefined,
      });
    } else {
      setIncludePayment(false);
      reset({
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        guestAddress: "",
        guestSource: GuestSource.WEBSITE,
        serviceId: "",
        userNotes: "",
        formData: {},
        paymentMethod: undefined,
        transactionId: undefined,
        senderNumber: undefined,
        paymentNote: undefined,
      });
    }
  }, [defaultValues, mode, reset]);

  useEffect(() => {
    if (mode === "create" && selectedServiceId) {
      setValue("formData", {}, { shouldDirty: true });
    }
  }, [selectedServiceId, mode, setValue]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleFormSubmit = async (data: RequestFormData) => {
    console.log("in request form at submit", { data });
    await onSubmit(data);
    if (mode === "create") {
      reset();
      setIncludePayment(false);
    }
  };

  const renderDynamicField = (field: any) => {
    const fieldName = `formData.${field.name}` as const;
    const value = watch(fieldName as any) ?? "";

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder || `Enter ${field.label}`}
            rows={field.rows || 3}
            value={value}
            onChange={(e) =>
              setValue(fieldName as any, e.target.value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        );
      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val) =>
              setValue(fieldName as any, val, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt: string) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder || `Enter ${field.label}`}
            value={value}
            onChange={(e) =>
              setValue(fieldName as any, e.target.value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        );
      default:
        return (
          <Input
            placeholder={field.placeholder || `Enter ${field.label}`}
            value={value}
            onChange={(e) =>
              setValue(fieldName as any, e.target.value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Request" : "Update Request"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Guest Info */}
          <div className="space-y-2">
            <Label>Guest Name</Label>
            <Input placeholder="Enter guest name" {...register("guestName")} />
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
            <Input placeholder="Enter address" {...register("guestAddress")} />
            {errors.guestAddress && (
              <p className="text-xs text-destructive">
                {errors.guestAddress.message}
              </p>
            )}
          </div>

          {/* Service Selection */}
          <div className="space-y-2">
            <Label>Service</Label>
            <Select
              value={watch("serviceId")}
              onValueChange={(value) =>
                setValue("serviceId", value, { shouldDirty: true })
              }
              disabled={isServicesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>
              <SelectContent>
                {servicesData?.data?.map((service: any) => (
                  <SelectItem key={service.id} value={service.id}>
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

          {/* Payment Section (guests only, non-quotation services) */}
          {!user && !selectedService?.requiresQuotation && (
            <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={includePayment}
                  onCheckedChange={(v) => setIncludePayment(v === true)}
                />
                <Label className="text-sm font-medium">
                  I have already made the payment
                </Label>
              </div>

              {includePayment && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select
                      value={watch("paymentMethod") || ""}
                      onValueChange={(v) =>
                        setValue("paymentMethod", v as PaymentMethod, {
                          shouldDirty: true,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHOD_OPTIONS.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.paymentMethod && (
                      <p className="text-xs text-destructive">
                        {errors.paymentMethod.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Transaction ID</Label>
                    <Input
                      placeholder="e.g. TRX123456"
                      {...register("transactionId")}
                    />
                    {errors.transactionId && (
                      <p className="text-xs text-destructive">
                        {errors.transactionId.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Sender Number</Label>
                    <Input
                      placeholder="e.g. +8801XXXXXXXX"
                      {...register("senderNumber")}
                    />
                    {errors.senderNumber && (
                      <p className="text-xs text-destructive">
                        {errors.senderNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Note (optional)</Label>
                    <Textarea
                      rows={2}
                      placeholder="Any note about your payment"
                      {...register("paymentNote")}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dynamic Fields */}
          {dynamicFields.length > 0 && (
            <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
              <h4 className="text-sm font-semibold text-muted-foreground">
                Service Details
              </h4>
              {dynamicFields.map((field: any) => (
                <div key={field.name} className="space-y-2">
                  <Label>
                    {field.label}
                    {field.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </Label>
                  {renderDynamicField(field)}
                </div>
              ))}
            </div>
          )}

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
              disabled={isLoading || (mode === "edit" && !isDirty)}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Create Request" : "Update Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
