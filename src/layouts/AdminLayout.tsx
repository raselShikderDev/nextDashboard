import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { NotificationPanel } from "../features/notifications/components/NotificationPanel";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { closePanel } from "../features/notifications/slice/notificationsSlice";

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isPanelOpen = useAppSelector((s) => s.notifications.isPanelOpen);
  const dispatch = useAppDispatch();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="hidden lg:flex">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      </div>
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
            <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <Sidebar collapsed={false} onToggle={() => setMobileSidebarOpen(false)} />
            </div>
          </>
        )}
      </AnimatePresence>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onMenuClick={() => setMobileSidebarOpen((o) => !o)} />
        <div className="flex flex-1 overflow-hidden relative">
          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <Outlet />
            </AnimatePresence>
          </main>
          <AnimatePresence>
            {isPanelOpen && <NotificationPanel onClose={() => dispatch(closePanel())} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
