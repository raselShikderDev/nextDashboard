import { UserDetails } from ".";
import { PaymentMethod, PaymentStatus } from "./enums.types";
import { ServiceRequest } from "./request.types";

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
  verifiedBy?: UserDetails | null;
  userDetails?: UserDetails | null;
}