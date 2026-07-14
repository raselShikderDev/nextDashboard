import { ServiceCategory } from "@/types/service.types";
import { baseApi } from "../../../app/baseApi";
import type { PaginatedResponse, FilterParams } from "../../../types";

export const serviceCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServiceCategories: builder.query<
      PaginatedResponse<ServiceCategory>,
      FilterParams | void
    >({
      query: (params = {}) => {
        const qs = new URLSearchParams();
        if (params && typeof params === "object") {
          Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== "") qs.set(k, String(v));
          });
        }
        return `/services/service-category?${qs.toString()}`;
      },
      // FIX: res IS the PaginatedResponse, not { data: PaginatedResponse }
      // No transformResponse needed — fetchBaseQuery returns the JSON body directly
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

    getServiceCategoryById: builder.query<ServiceCategory, string>({
      query: (id) => `/services/service-category/${id}`,
      providesTags: (_r, _e, id) => [{ type: "ServiceCategory", id }],
    }),

    createServiceCategory: builder.mutation<
      ServiceCategory,
      {
        name: string;
        slug: string;
        description?: string;
        icon?: string;
        sortOrder?: number;
      }
    >({
      query: (body) => ({
        url: "/services/category-create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ServiceCategory", id: "LIST" }],
    }),

    updateServiceCategory: builder.mutation<
      ServiceCategory,
      { id: string; body: Partial<Omit<ServiceCategory, "id" | "createdAt" | "updatedAt">> }
    >({
      query: ({ id, body }) => ({
        url: `/services/service-category/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ServiceCategory", id },
        { type: "ServiceCategory", id: "LIST" },
      ],
    }),

    deleteServiceCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/services/service-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ServiceCategory", id: "LIST" }],
    }),

    toggleServiceCategoryStatus: builder.mutation<ServiceCategory, string>({
      query: (id) => ({
        url: `/services/service-category/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "ServiceCategory", id },
        { type: "ServiceCategory", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllServiceCategoriesQuery,
  useGetServiceCategoryByIdQuery,
  useCreateServiceCategoryMutation,
  useUpdateServiceCategoryMutation,
  useDeleteServiceCategoryMutation,
  useToggleServiceCategoryStatusMutation,
} = serviceCategoryApi;