import { motion } from "framer-motion";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
