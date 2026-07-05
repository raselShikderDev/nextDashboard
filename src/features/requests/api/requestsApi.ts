import { ServiceRequest } from "@/types/request.types";
import { baseApi } from "../../../app/baseApi";
import type { PaginatedResponse, FilterParams } from "../../../types";

export const requestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({ 
    getRequests: builder.query< PaginatedResponse<ServiceRequest[]>, FilterParams>({
      query: (params = {}) => {
        const qs = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== "") {
            qs.set(k, String(v));
          }
        });
        console.log(qs);
        
        return `/requests?${qs.toString()}`;
      },

      providesTags: (result) =>
        result
          ? [
              ...result?.data.map((request) => ({
                type: "Request" as const,
                request,
              })),
              { type: "Request" as const, id: "LIST" },
            ]
          : [{ type: "Request" as const, id: "LIST" }],
    }),

    getRequestById: builder.query<ServiceRequest, string>({
      query: (id) => `/requests/${id}`,
      transformResponse: (res: { data: ServiceRequest }) => res.data,
      providesTags: (_r, _e, id) => [{ type: "Request", id }],
    }),

    createRequest: builder.mutation<ServiceRequest, Partial<ServiceRequest>>({
      query: (body) => ({ url: "/requests", method: "POST", body }),
      transformResponse: (res: { data: ServiceRequest }) => res.data,
      invalidatesTags: [{ type: "Request", id: "LIST" }],
    }),

    updateRequest: builder.mutation< ServiceRequest, { id: string; body: Partial<ServiceRequest> } >({
      query: ({ id, body }) => ({
        url: `/request/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Request", id },
        { type: "Request", id: "LIST" },
      ],
    }),

    deleteRequest: builder.mutation<void, string>({
      query: (id) => ({ url: `/requests/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Request", id: "LIST" }],
    }),

    approveRequest: builder.mutation<ServiceRequest, string>({
      query: (id) => ({ url: `/requests/${id}/approve`, method: "PATCH" }),
      transformResponse: (res: { data: ServiceRequest }) => res.data,
      invalidatesTags: (_r, _e, id) => [{ type: "Request", id }],
    }),

    stratWorkRequest: builder.mutation<ServiceRequest, string>({
      query: (id) => ({ url: `/requests/start-work/${id}`, method: "PATCH" }),
      transformResponse: (res: { data: ServiceRequest }) => res.data,
      invalidatesTags: (_r, _e, id) => [{ type: "Request", id }],
    }),

    markCompleteRequest: builder.mutation<ServiceRequest, string>({
      query: (id) => ({
        url: `/requests/mark-completed/${id}`,
        method: "PATCH",
      }),
      transformResponse: (res: { data: ServiceRequest }) => res.data,
      invalidatesTags: (_r, _e, id) => [{ type: "Request", id }],
    }),

    DeliveryRequest: builder.mutation<ServiceRequest, string>({
      query: (id) => ({ url: `/requests/${id}/deliver`, method: "PATCH" }),
      transformResponse: (res: { data: ServiceRequest }) => res.data,
      invalidatesTags: (_r, _e, id) => [{ type: "Request", id }],
    }),

    cancelRequest: builder.mutation<  ServiceRequest,  { id: string; notes?: string }  >({
      query: ({ id, notes }) => ({
        url: `/requests/cancel/${id}`,
        method: "PATCH",
        body: { notes },
      }),
      transformResponse: (res: { data: ServiceRequest }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: "Request", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRequestsQuery,
  useGetRequestByIdQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useDeleteRequestMutation,
  useApproveRequestMutation,
  useCancelRequestMutation,
  useStratWorkRequestMutation,
  useMarkCompleteRequestMutation
} = requestsApi;
