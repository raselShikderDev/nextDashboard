import { ServiceRequest } from "@/types/request.types";
import { baseApi } from "../../../app/baseApi";
import type { Request, PaginatedResponse, FilterParams } from "../../../types";

export const requestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRequests: builder.query<PaginatedResponse<ServiceRequest>, FilterParams>(
      {
        query: (params = {}) => {
          const qs = new URLSearchParams();

          Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== "") {
              qs.set(k, String(v));
            }
          });
          return `/requests?${qs.toString()}`;
        },
        transformResponse: (res: {
          data: PaginatedResponse<ServiceRequest>;
        }) => {
          console.log("REQUESTS RESPONSE:", res?.data);
          return res?.data;
        },
        // providesTags: (result) => result ? [...result.data.map(({ id }) => ({ type: "Request" as const, id, })),  { type: "Request" as const, id: "LIST" },] : [{ type: "Request" as const, id: "LIST" }],
      },
    ),

    getRequestById: builder.query<Request, string>({
      query: (id) => `/requests/${id}`,
      transformResponse: (res: { data: Request }) => res.data,
      providesTags: (_r, _e, id) => [{ type: "Request", id }],
    }),

    createRequest: builder.mutation<Request, Partial<Request>>({
      query: (body) => ({ url: "/requests", method: "POST", body }),
      transformResponse: (res: { data: Request }) => res.data,
      invalidatesTags: [{ type: "Request", id: "LIST" }],
    }),

    updateRequest: builder.mutation<
      Request,
      { id: string; body: Partial<Request> }
    >({
      query: ({ id, body }) => ({
        url: `/requests/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: { data: Request }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Request", id },
        { type: "Request", id: "LIST" },
      ],
    }),

    deleteRequest: builder.mutation<void, string>({
      query: (id) => ({ url: `/requests/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Request", id: "LIST" }],
    }),

    approveRequest: builder.mutation<Request, string>({
      query: (id) => ({ url: `/requests/${id}/approve`, method: "PATCH" }),
      transformResponse: (res: { data: Request }) => res.data,
      invalidatesTags: (_r, _e, id) => [{ type: "Request", id }],
    }),

    rejectRequest: builder.mutation<Request, { id: string; notes?: string }>({
      query: ({ id, notes }) => ({
        url: `/requests/${id}/reject`,
        method: "PATCH",
        body: { notes },
      }),
      transformResponse: (res: { data: Request }) => res.data,
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
  useRejectRequestMutation,
} = requestsApi;
