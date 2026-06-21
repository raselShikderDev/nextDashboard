import { PaymentStatus, Role } from "./enums.types";

export interface UserDetails {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string | null;
  address: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  userDetails: UserDetails;
}

export interface AuthUser extends User {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}


export interface Payment {
  id: string;
  requestId: string;
  request?: Request;
  userId: string;
  user?: User;
  amount: number;
  status: PaymentStatus;
  method: "credit_card" | "bank_transfer" | "cash" | "online";
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  userId: string;
  link?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface DashboardStats {
  totalUsers: number;
  totalRequests: number;
  totalPayments: number;
  totalRevenue: number;
  pendingRequests: number;
  pendingPayments: number;
  activeServices: number;
  userGrowth: number;
  revenueGrowth: number;
  requestGrowth: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

export interface UserGrowthData {
  month: string;
  users: number;
  active: number;
}

export interface RequestTrendData {
  date: string;
  pending: number;
  approved: number;
  completed: number;
  rejected: number;
}

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}
