import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { router } from "./routes";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
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
    </Provider>
  );
}
