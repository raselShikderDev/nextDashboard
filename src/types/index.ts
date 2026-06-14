export type UserRole = "admin" | "manager" | "user";
export type RequestStatus = "pending" | "approved" | "rejected" | "in_progress" | "completed";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type ServiceStatus = "active" | "inactive" | "deprecated";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface AuthUser extends User {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: ServiceStatus;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  priority: "low" | "medium" | "high" | "urgent";
  userId: string;
  user?: User;
  serviceId: string;
  service?: Service;
  assignedTo?: string;
  assignee?: User;
  amount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
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
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
