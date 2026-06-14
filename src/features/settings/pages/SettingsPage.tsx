import { useState } from "react";
import { User, Shield, Bell, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { PageWrapper } from "../../../layouts/PageWrapper";
import { PageHeader } from "../../../components/PageHeader";
import { ProfileSettings } from "../components/ProfileSettings";
import { SecuritySettings } from "../components/SecuritySettings";
import { cn } from "../../../lib/utils";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
];

function NotificationPreferences() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Notification Preferences</h2>
        <p className="text-sm text-muted-foreground mt-1">Choose how and when you receive notifications.</p>
      </div>
      <div className="space-y-4 max-w-lg">
        {[
          { label: "New Requests", description: "When a new request is submitted" },
          { label: "Request Updates", description: "When request status changes" },
          { label: "Payment Alerts", description: "Payment received or failed" },
          { label: "System Updates", description: "Maintenance and system alerts" },
        ].map(({ label, description }) => (
          <div key={label} className="flex items-center justify-between p-4 rounded-xl border bg-card">
            <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{description}</p></div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Appearance</h2>
        <p className="text-sm text-muted-foreground mt-1">Customize the look and feel of your dashboard.</p>
      </div>
      <div className="space-y-4 max-w-lg">
        <div>
          <p className="text-sm font-medium mb-3">Theme</p>
          <div className="grid grid-cols-3 gap-3">
            {["Light", "Dark", "System"].map((theme) => (
              <button key={theme} className={cn("p-3 rounded-xl border text-sm font-medium transition-all", theme === "System" ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50")}>
                {theme}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium mb-3">Accent Color</p>
          <div className="flex gap-3">
            {["#6366f1","#8b5cf6","#ec4899","#f97316","#22c55e","#0ea5e9"].map((color) => (
              <button key={color} className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-current transition-all" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTab = () => {
    switch (activeTab) {
      case "profile": return <ProfileSettings />;
      case "security": return <SecuritySettings />;
      case "notifications": return <NotificationPreferences />;
      case "appearance": return <AppearanceSettings />;
      default: return null;
    }
  };

  return (
    <PageWrapper>
      <PageHeader title="Settings" description="Manage your account and preferences" />
      <div className="flex flex-col lg:flex-row gap-6">
        <nav className="lg:w-52 shrink-0">
          <div className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all", activeTab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
        </nav>
        <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="flex-1 bg-card border border-border rounded-xl p-6">
          {renderTab()}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
