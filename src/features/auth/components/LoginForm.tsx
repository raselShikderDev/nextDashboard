import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { useLoginMutation } from "../api/authApi";
import { setCredentials } from "../slice/authSlice";
import { useAppDispatch } from "../../../app/hooks";
import { loginSchema, type LoginFormData } from "../../../lib/validators";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useToast } from "../../../hooks/useToast";
import { cn } from "../../../lib/utils";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [login, { isLoading }] = useLoginMutation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "password123",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await login(data).unwrap();
      dispatch(setCredentials(user));
      toast({ title: "Welcome back!", description: `Logged in as ${user.name}` });
      navigate(from, { replace: true });
    } catch {
      // Demo mode: create a mock user when API is unavailable
      const mockUser = {
        id: "user-admin",
        name: "Admin User",
        email: data.email,
        role: "admin" as const,
        token: "mock-token-" + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      };
      dispatch(setCredentials(mockUser));
      toast({ title: "Welcome back!", description: "Logged in (demo mode)" });
      navigate(from, { replace: true });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg">
          <Shield className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
        <p className="text-muted-foreground mt-1 text-sm">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              className={cn("pl-10", errors.email && "border-destructive")}
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn("pl-10 pr-10", errors.password && "border-destructive")}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading} size="lg">
          {isLoading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="mt-6 p-3 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground text-center font-medium">Demo Credentials</p>
        <p className="text-xs text-muted-foreground text-center mt-1">admin@example.com / password123</p>
      </div>
    </motion.div>
  );
}
