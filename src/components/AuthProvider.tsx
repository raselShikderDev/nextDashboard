import { useEffect, useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/features/auth/slice/authSlice";
import { useGetMeQuery } from "@/features/users/api/usersApi"; // adjust path
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);

  // Fetch profile on every mount (refresh). If token is invalid, isError becomes true.
  const { data: meData, isLoading } = useGetMeQuery(undefined, {
    // Don't refetch on focus/reconnect during this init phase
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    // When getMe returns successfully, hydrate Redux so route guards see the user
    if (meData) {
      // Adjust extraction based on your API wrapper:
      // Your backend wraps as { success, message, data: User }
      const user = (meData as any)?.data ?? meData;
      if (user) {
        dispatch(setCredentials(user));
      }
    }

    // Once the query settles (success or error), we're ready to render the app
    if (!isLoading) {
      setReady(true);
    }
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