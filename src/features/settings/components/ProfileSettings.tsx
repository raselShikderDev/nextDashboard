import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Camera } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { profileSchema, type ProfileFormData } from "../../../lib/validators";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { updateUser } from "../../auth/slice/authSlice";
import { useToast } from "../../../hooks/useToast";
import { getInitials } from "../../../lib/utils";
import { useState } from "react";

export function ProfileSettings() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "", department: user?.department ?? "" },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    dispatch(updateUser(data));
    toast({ title: "Profile updated successfully" });
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Profile Information</h2>
        <p className="text-sm text-muted-foreground mt-1">Update your account details and personal information.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-xl bg-primary text-primary-foreground">{user ? getInitials(user.name) : "?"}</AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <p className="font-medium">{user?.name}</p>
          <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input placeholder="+1 234 567 890" {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Input placeholder="Engineering" {...register("department")} />
          </div>
        </div>
        <Button type="submit" disabled={!isDirty || isSaving}>
          {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </div>
  );
}
