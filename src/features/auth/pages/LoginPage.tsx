import { motion } from "framer-motion";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex-col justify-between p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-white font-bold text-xl">AdminPro</span>
          </div>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Enterprise Admin<br />Dashboard
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Manage your business operations with a powerful, real-time dashboard. Monitor requests,
            payments, users, and services all in one place.
          </p>
          <div className="flex gap-4 flex-wrap">
            {["Requests", "Payments", "Users", "Services"].map((feature) => (
              <div key={feature} className="px-3 py-1.5 bg-white/10 backdrop-blur rounded-lg text-white text-sm font-medium">
                {feature}
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex gap-8">
          {[{ label: "Active Users", value: "2.4K" }, { label: "Requests", value: "18K" }, { label: "Uptime", value: "99.9%" }].map(({ label, value }) => (
            <div key={label}>
              <p className="text-white font-bold text-2xl">{value}</p>
              <p className="text-white/70 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
