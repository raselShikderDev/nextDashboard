import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Shield, Key, LogOut } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { useToast } from "../../../hooks/useToast";
import { useAppDispatch } from "../../../app/hooks";
import { logout } from "../../auth/slice/authSlice";
import { useChangePasswordMutation } from "@/features/auth/api/authApi";
import {
  resetPasswordFormData,
  resetPasswordSchema,
} from "../validators/zodvalidator";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { useAppSelector } from "../../../app/hooks";

export function SecuritySettings() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [changePassword, { isLoading: isChanging }] =
    useChangePasswordMutation();
    const user = useAppSelector((s) => s.auth.user);
  const mustChange = user?.mustChangePassword === true;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<resetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: resetPasswordFormData) => {
    try {
      await changePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast({ title: "Password changed successfully" });
      reset();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to change password",
        description: err?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner when forced */}
      {mustChange && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription>
            You must change your password before you can access other parts of
            the dashboard.
          </AlertDescription>
        </Alert>
      )}
      <div>
        <h2 className="text-lg font-semibold">Security Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your password and account security preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Key className="w-4 h-4" />
            Change Password
          </CardTitle>
          <CardDescription>
            Use a strong password with at least 8 characters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-w-sm"
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <p className="text-xs text-destructive">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-xs text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isChanging}>
              {isChanging && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="w-4 h-4" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Authenticator App</p>
              <p className="text-xs text-muted-foreground">Not configured</p>
            </div>
            <Button variant="outline" size="sm">
              Setup 2FA
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h3 className="text-base font-semibold text-destructive mb-3">
          Danger Zone
        </h3>
        <Card className="border-destructive/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sign out of all sessions</p>
                <p className="text-xs text-muted-foreground">
                  Sign out from all devices and browsers.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => dispatch(logout())}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
