import { ApiResponse } from "@/features/auth/api/authApi";
import { baseApi } from "../../../app/baseApi";
import type { User, PaginatedResponse, FilterParams } from "../../../types";
import { StaffFormData } from "../components/CreateStaffForm";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, FilterParams>({
      query: (params = {}) => {
        const qs = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== "") qs.set(k, String(v));
        });
        return `/user?${qs.toString()}`;
      },
      transformResponse: (res: PaginatedResponse<User>) => res,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    getMe: builder.query<User, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<User>) => response.data,
      providesTags: ["User"],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (res: { data: User }) => res.data,
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),

    createUser: builder.mutation<User, Partial<User> & { password?: string }>({
      query: (body) => ({ url: "/users", method: "POST", body }),
      transformResponse: (res: { data: User }) => res.data,
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    createStaff: builder.mutation<User, StaffFormData>({
  query: (body) => ({ url: "/user/create-staff", method: "POST", body }),
  transformResponse: (res: { data: User }) => res.data,
  invalidatesTags: [{ type: "User", id: "LIST" }],
}),

    updateUser: builder.mutation<User, { id: string; body: Partial<User> }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: "PATCH", body }),
      transformResponse: (res: { data: User }) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: "User", id }],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    toggleUserStatus: builder.mutation<User, string>({
      query: (id) => ({ url: `/users/${id}/toggle-status`, method: "PATCH" }),
      transformResponse: (res: { data: User }) => res.data,
      invalidatesTags: (_r, _e, id) => [{ type: "User", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  useGetMeQuery,
  useCreateStaffMutation,
} = usersApi;
