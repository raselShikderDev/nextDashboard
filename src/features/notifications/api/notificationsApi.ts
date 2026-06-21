import { baseApi } from "../../../app/baseApi";
import type { Notification, PaginatedResponse } from "../../../types";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<PaginatedResponse<Notification>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => `/notifications?page=${page}&limit=${limit}`,
      transformResponse: (res: { data: PaginatedResponse<Notification> }) => res.data,
      providesTags: ["Notification"],
    }),
    markNotificationRead: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: ["Notification"],
    }),
    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({ url: "/notifications/read-all", method: "PATCH" }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}`, method: "DELETE" }),
      invalidatesTags: ["Notification"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
