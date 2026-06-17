import { LoginResponse } from "@/types/auth.types";
import { baseApi } from "../../../app/baseApi";
import type { LoginCredentials, User } from "../../../types";


export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { data: LoginResponse }) => response.data,
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

   

    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<{ accessToken: string }>) =>
        response.data,
    }),

    changePassword: builder.mutation<
      void,
      {
        currentPassword: string;
        newPassword: string;
      }
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useChangePasswordMutation,
} = authApi;
