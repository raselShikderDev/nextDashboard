import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Switch } from "../../../components/ui/switch";
import { userSchema, type UserFormData } from "../../../lib/validators";
import type { User } from "../../../types";

interface UserFormProps {
  open: boolean; onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  defaultValues?: User; isLoading?: boolean; mode?: "create" | "edit";
}

export function UserForm({ open, onOpenChange, onSubmit, defaultValues, isLoading, mode = "create" }: UserFormProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: defaultValues?.name ?? "", email: defaultValues?.email ?? "",
      role: defaultValues?.role ?? "user", phone: defaultValues?.phone ?? "",
      department: defaultValues?.department ?? "", isActive: defaultValues?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({ name: defaultValues.name, email: defaultValues.email, role: defaultValues.role, phone: defaultValues.phone ?? "", department: defaultValues.department ?? "", isActive: defaultValues.isActive });
    } else {
      reset({ name: "", email: "", role: "user", phone: "", department: "", isActive: true });
    }
  }, [defaultValues, reset]);

  const handleClose = () => { reset(); onOpenChange(false); };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{mode === "create" ? "Create User" : "Edit User"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Full Name</Label>
              <Input placeholder="John Doe" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Email</Label>
              <Input type="email" placeholder="john@example.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            {mode === "create" && (
              <div className="space-y-2 col-span-2">
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" {...register("password")} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
            )}
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={watch("role")} onValueChange={(v) => setValue("role", v as UserFormData["role"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="+1 234 567 890" {...register("phone")} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Department</Label>
              <Input placeholder="Engineering" {...register("department")} />
            </div>
            <div className="col-span-2 flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Active Status</p>
                <p className="text-xs text-muted-foreground">User can login and access system</p>
              </div>
              <Switch checked={watch("isActive")} onCheckedChange={(v) => setValue("isActive", v)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create User" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
