import { useEffect, useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/features/auth/slice/authSlice";
import { useGetMeQuery } from "@/features/users/api/usersApi";
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);

  const { data: meData, isLoading } = useGetMeQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (meData) {
      // API returns { response: { data: User } }
      const user = (meData as any)?.response?.data ?? (meData as any)?.data ?? meData;
      if (user) dispatch(setCredentials(user));
    }
    if (!isLoading) setReady(true);
  }, [meData, isLoading, dispatch]);

  if (!ready) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}