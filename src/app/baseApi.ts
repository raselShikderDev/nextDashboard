import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

const baseUrl = "http://localhost:5000/api/v1";
console.log({ baseUrl });

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: [
    "User",
    "Request",
    "Payment",
    "Service",
    "Notification",
    "Dashboard",
  ],
  endpoints: () => ({}),
});

