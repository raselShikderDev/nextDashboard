import { User } from ".";
import type { PaymentMethod, PaymentStatus } from "./enums.types";
import type { ServiceRequest } from "./request.types";

export interface Payment {
  id: string;
  requestId: string;
  amount: string;
  currency: string;
  method: PaymentMethod;
  transactionId: string;
  senderNumber: string | null;
  screenshotUrl: string | null;
  screenshotKey: string | null;
  submittedAt: string;
  userNote: string | null;
  status: PaymentStatus;
  verifiedById: string | null;
  verifiedAt: string | null;
  rejectionReason: string | null;
  adminNote: string | null;
  userDetailsId: string | null;
  createdAt: string;
  updatedAt: string;

  request?: ServiceRequest;
  verifiedBy?: User | null;
  userDetails?: User | null;
}


export interface PaymentAnalytics {
  totalPayments: number;
  pendingPayments: number;
  verifiedPayments: number;
  rejectedPayments: number;
  totalRevenue: number;
  verifiedRevenue: number;
  todayRevenue: number;
  last7DaysRevenue: number;
  last30DaysRevenue: number;
  methodStats: Array<{
    method: string;
    _count: { method: number };
    _sum: { amount: number };
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
}