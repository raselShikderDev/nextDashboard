import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { requestSchema, type RequestFormData } from "../../../lib/validators";
import type { Request } from "../../../types";

const MOCK_SERVICES = [
  { id: "svc-1", name: "Web Development" }, { id: "svc-2", name: "UI/UX Design" },
  { id: "svc-3", name: "Data Analytics" }, { id: "svc-4", name: "Cloud Hosting" }, { id: "svc-5", name: "IT Support" },
];

interface RequestFormProps {
  open: boolean; onOpenChange: (open: boolean) => void;
  onSubmit: (data: RequestFormData) => Promise<void>;
  defaultValues?: Partial<Request>; isLoading?: boolean; mode?: "create" | "edit";
}

export function RequestForm({ open, onOpenChange, onSubmit, defaultValues, isLoading, mode = "create" }: RequestFormProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: { title: defaultValues?.title ?? "", description: defaultValues?.description ?? "", priority: defaultValues?.priority ?? "medium", serviceId: defaultValues?.serviceId ?? "", amount: defaultValues?.amount ?? 0, notes: defaultValues?.notes ?? "" },
  });

  const handleClose = () => { reset(); onOpenChange(false); };
  const handleFormSubmit = async (data: RequestFormData) => { await onSubmit(data); reset(); };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{mode === "create" ? "New Request" : "Edit Request"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="Request title" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe the request..." rows={3} {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={watch("priority")} onValueChange={(v) => setValue("priority", v as RequestFormData["priority"])}>
                <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                <SelectContent>{["low", "medium", "high", "urgent"].map((p) => (<SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input type="number" min={0} step={0.01} placeholder="0.00" {...register("amount")} />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Service</Label>
            <Select value={watch("serviceId")} onValueChange={(v) => setValue("serviceId", v)}>
              <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
              <SelectContent>{MOCK_SERVICES.map((svc) => (<SelectItem key={svc.id} value={svc.id}>{svc.name}</SelectItem>))}</SelectContent>
            </Select>
            {errors.serviceId && <p className="text-xs text-destructive">{errors.serviceId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea placeholder="Additional notes..." rows={2} {...register("notes")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create Request" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
