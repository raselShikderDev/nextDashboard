import { Payment, PaymentAnalytics } from "@/types/payment.types";
import { baseApi } from "../../../app/baseApi";
import type { PaginatedResponse, FilterParams } from "../../../types";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<PaginatedResponse<Payment>, FilterParams>({
      query: (params = {}) => {
        const qs = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== "") qs.set(k, String(v));
        });
        return `/payment?${qs.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Payment" as const,
                id,
              })),
              { type: "Payment", id: "LIST" },
            ]
          : [{ type: "Payment", id: "LIST" }],
    }),

    getPaymentById: builder.query<Payment, string>({
      query: (id) => `/payments/${id}`,
      transformResponse: (res: { data: Payment }) => res.data,
      providesTags: (_r, _e, id) => [{ type: "Payment", id }],
    }),

    createPayment: builder.mutation<Payment, Partial<Payment>>({
      query: (body) => ({ url: "/payments", method: "POST", body }),
      transformResponse: (res: { data: Payment }) => res.data,
      invalidatesTags: [{ type: "Payment", id: "LIST" }],
    }),
    getPaymentAnalytics: builder.query<PaymentAnalytics, void>({
      query: () => "/payments/analytics",
      providesTags: ["Payment"],
    }),

    verifyPayment: builder.mutation<  Payment, { id: string; adminNote?: string } >({
      query: ({ id, adminNote }) => ({
        url: `/payments/verify/${id}`,
        method: "PATCH",
        body: { adminNote },
      }),
      invalidatesTags: ["Payment"],
    }),

    rejectPayment: builder.mutation<  Payment,  { id: string; rejectionReason: string; adminNote?:string }>({
      query: ({ id, rejectionReason, adminNote }) => ({
        url: `/payments/reject/${id}`,
        method: "PATCH",
        body: { rejectionReason, adminNote },
      }),
      invalidatesTags: ["Payment"],
    }),

    deletePayment: builder.mutation<void, string>({
      query: (id) => ({ url: `/payments/${id}`, method: "DELETE" }),
      invalidatesTags: ["Payment"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useDeletePaymentMutation,
  useGetPaymentAnalyticsQuery,
  useRejectPaymentMutation,
  useVerifyPaymentMutation,
} = paymentsApi;
