import { Service, ServiceCategory } from "@/types/service.types";
import { baseApi } from "../../../app/baseApi";
import type { PaginatedResponse, FilterParams } from "../../../types";

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServices: builder.query<PaginatedResponse<Service>, FilterParams>({
      query: (params = {}) => {
        const qs = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== "") qs.set(k, String(v));
        });
        return `/services?${qs.toString()}`;
      },
      transformResponse: (res: { data: PaginatedResponse<Service> }) =>
        res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Service" as const,
                id,
              })),
              { type: "Service", id: "LIST" },
            ]
          : [{ type: "Service", id: "LIST" }],
    }),

    createServiceCategory: builder.query<PaginatedResponse<ServiceCategory>, Partial<ServiceCategory> >({
      query: (body) => ({
        url: `/services/category-create`,
        method: "POST",
        body,
      }),
      transformResponse: (res: { data: PaginatedResponse<ServiceCategory> }) =>
        res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "ServiceCategory" as const,
                id,
              })),
              { type: "ServiceCategory", id: "LIST" },
            ]
          : [{ type: "ServiceCategory", id: "LIST" }],
    }),

    getServiceCategory: builder.query<Service, string>({
      query: () => `/services/service-category`,
      transformResponse: (res: { data: Service }) => res.data,
      providesTags: (_r, _e, id) => [{ type: "ServiceCategory", id }],
    }),
    getServiceById: builder.query<Service, string>({
      query: (id) => `/services/${id}`,
      transformResponse: (res: { data: Service }) => res.data,
      providesTags: (_r, _e, id) => [{ type: "Service", id }],
    }),

    createService: builder.mutation<Service, Partial<Service>>({
      query: (body) => ({ url: "/services", method: "POST", body }),
      transformResponse: (res: { data: Service }) => res.data,
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),

    updateService: builder.mutation< Service,{ id: string; body: Partial<Service> }>({
      query: ({ id, body }) => ({
        url: `/services/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: { data: Service }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Service", id },
        { type: "Service", id: "LIST" },
      ],
    }),

    deleteService: builder.mutation<void, string>({
      query: (id) => ({ url: `/services/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),

    toggleServiceStatus: builder.mutation<Service, string>({
      query: (id) => ({
        url: `/services/${id}/toggle-status`,
        method: "PATCH",
      }),
      transformResponse: (res: { data: Service }) => res.data,
      invalidatesTags: (_r, _e, id) => [
        { type: "Service", id },
        { type: "Service", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServiceCategoryQuery,
  useToggleServiceStatusMutation,
} = servicesApi;
