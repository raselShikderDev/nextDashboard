import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Shield, Key, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { passwordSchema, type PasswordFormData } from "../../../lib/validators";
import { useToast } from "../../../hooks/useToast";
import { useAppDispatch } from "../../../app/hooks";
import { logout } from "../../auth/slice/authSlice";

export function SecuritySettings() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (_data: PasswordFormData) => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast({ title: "Password changed successfully" });
    reset();
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Security Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your password and account security preferences.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Key className="w-4 h-4" />Change Password</CardTitle>
          <CardDescription>Use a strong password with at least 8 characters.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" {...register("currentPassword")} />
              {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" {...register("newPassword")} />
              {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Shield className="w-4 h-4" />Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Authenticator App</p><p className="text-xs text-muted-foreground">Not configured</p></div>
            <Button variant="outline" size="sm">Setup 2FA</Button>
          </div>
        </CardContent>
      </Card>
      <Separator />
      <div>
        <h3 className="text-base font-semibold text-destructive mb-3">Danger Zone</h3>
        <Card className="border-destructive/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sign out of all sessions</p>
                <p className="text-xs text-muted-foreground">Sign out from all devices and browsers.</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => dispatch(logout())}>
                <LogOut className="w-4 h-4 mr-2" />Sign Out All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
