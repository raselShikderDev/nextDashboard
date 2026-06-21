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
import { toast } from "sonner";
import { cn } from "../../../lib/utils";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const loadingId = toast.loading("Signing you in...");

    try {
      const result = await login(data).unwrap();

      dispatch(setCredentials(result.user));

      toast.success("Welcome back 👋", {
        id: loadingId,
        description: "Successfully signed in",
      });

      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      toast.error("Login failed", {
        id: loadingId,
        description: error?.message || "Invalid credentials",
      });

      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0"
    >
      <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm dark:shadow-none p-6 sm:p-8">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg dark:shadow-primary/20">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Admin Portal
          </h1>
          <p className="text-muted-foreground mt-1 text-sm text-center">
            Sign in to your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-5"
        >
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                className={cn(
                  "pl-10 h-11 sm:h-10 text-base sm:text-sm",
                  errors.email &&
                    "border-destructive focus-visible:ring-destructive",
                )}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={cn(
                  "pl-10 pr-10 h-11 sm:h-10 text-base sm:text-sm",
                  errors.password &&
                    "border-destructive focus-visible:ring-destructive",
                )}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 sm:h-10 text-base sm:text-sm"
            disabled={isLoading}
            size="default"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
