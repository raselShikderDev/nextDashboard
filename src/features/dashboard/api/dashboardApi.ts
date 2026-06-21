import { baseApi } from "../../../app/baseApi";
import type { DashboardStats, RevenueData, UserGrowthData, RequestTrendData } from "../../../types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/dashboard/stats",
      transformResponse: (res: { data: DashboardStats }) => res.data,
      providesTags: ["Dashboard"],
    }),
    getRevenueData: builder.query<RevenueData[], { months?: number }>({
      query: ({ months = 12 } = {}) => `/dashboard/revenue?months=${months}`,
      transformResponse: (res: { data: RevenueData[] }) => res.data,
      providesTags: ["Dashboard"],
    }),
    getUserGrowthData: builder.query<UserGrowthData[], { months?: number }>({
      query: ({ months = 12 } = {}) => `/dashboard/user-growth?months=${months}`,
      transformResponse: (res: { data: UserGrowthData[] }) => res.data,
      providesTags: ["Dashboard"],
    }),
    getRequestTrends: builder.query<RequestTrendData[], { days?: number }>({
      query: ({ days = 30 } = {}) => `/dashboard/request-trends?days=${days}`,
      transformResponse: (res: { data: RequestTrendData[] }) => res.data,
      providesTags: ["Dashboard"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardStatsQuery, useGetRevenueDataQuery, useGetUserGrowthDataQuery, useGetRequestTrendsQuery } = dashboardApi;
