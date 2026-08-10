import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
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
import { Checkbox } from "../../../components/ui/checkbox";
import { Role } from "@/types/enums";

const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.nativeEnum(Role),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export type StaffFormData = z.infer<typeof staffSchema>;

interface CreateStaffFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StaffFormData) => Promise<void>;
  defaultValues?: Partial<StaffFormData> | null;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export function CreateStaffForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading,
  mode = "create",
}: CreateStaffFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [setCustomPassword, setSetCustomPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: Role.USER,
      password: undefined,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      const hasPassword = !!defaultValues.password;
      setSetCustomPassword(hasPassword);

      reset({
        name: defaultValues.name ?? "",
        email: defaultValues.email ?? "",
        phone: defaultValues.phone ?? "",
        role: (defaultValues.role as Role) ?? Role.USER,
        password: defaultValues.password ?? undefined,
      });
    } else {
      setSetCustomPassword(false);
      reset({
        name: "",
        email: "",
        phone: "",
        role: Role.USER,
        password: undefined,
      });
    }
  }, [defaultValues, reset]);

  const handleClose = () => {
    reset();
    setSetCustomPassword(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Staff" : "Edit Staff"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input placeholder="John Doe" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="john@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <Input placeholder="+880 1XXX-XXXXXX" {...register("phone")} />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={watch("role")}
              onValueChange={(v) => setValue("role", v as Role)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                <SelectItem value={Role.MANAGER}>Manager</SelectItem>
                <SelectItem value={Role.USER}>User</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>

          {/* Custom Password Toggle */}
          {mode === "create" && (
            <div className="flex items-center gap-2 border rounded-lg p-3 bg-muted/30">
              <Checkbox
                checked={setCustomPassword}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setSetCustomPassword(isChecked);
                  if (!isChecked) {
                    setValue("password", undefined, { shouldDirty: true });
                  }
                }}
              />
              <Label className="text-sm font-medium cursor-pointer">
                Set custom password
              </Label>
              <span className="text-xs text-muted-foreground ml-auto">
                {setCustomPassword
                  ? "User will login with this password"
                  : "Auto-generated password will be emailed"}
              </span>
            </div>
          )}

          {/*  Password Field (conditional) */}
          {mode === "create" && setCustomPassword && (
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

          <DialogFooter className="gap-y-3">
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
              {mode === "create" ? "Create Staff" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}