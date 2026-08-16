import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { router } from "./routes";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./components/AuthProvider";

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand
        duration={4000}
        theme="system"
        visibleToasts={5}
        toastOptions={{
          style: {
            borderRadius: "16px",
          },
        }}
      />
      {/* <WhatsAppButton /> */}
    </Provider>
  );
}
