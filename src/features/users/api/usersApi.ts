import { baseApi } from "../../../app/baseApi";
import type { User, PaginatedResponse, FilterParams } from "../../../types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, FilterParams>({
      query: (params = {}) => {
        const qs = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== "") qs.set(k, String(v)); });
        return `/users?${qs.toString()}`;
      },
      transformResponse: (res: { data: PaginatedResponse<User> }) => res.data,
      providesTags: (result) => result ? [...result.data.map(({ id }) => ({ type: "User" as const, id })), { type: "User", id: "LIST" }] : [{ type: "User", id: "LIST" }],
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

export const { useGetUsersQuery, useGetUserByIdQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation, useToggleUserStatusMutation } = usersApi;
