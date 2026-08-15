import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { useToast } from "@/hooks/useToast";

export function usePasswordChangeRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((s) => s.auth.user);
  const { toast } = useToast();
  const hasToasted = useRef(false);

  const mustChange = user?.mustChangePassword === true;
  const isOnSettings = location.pathname === "/settings";

  useEffect(() => {
    if (!mustChange) return;
    if (isOnSettings) return;

    // Push to settings once
    navigate("/settings", { replace: true });

    // Toast only once per session
    if (!hasToasted.current) {
      hasToasted.current = true;
      toast({
        variant: "destructive",
        title: "Password change required",
        description: "Please update your password in Security Settings before continuing.",
      });
    }
  }, [mustChange, isOnSettings, navigate, toast]);
}