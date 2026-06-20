export type RequestStatus =
  | "SUBMITTED"
  | "CLAIMED"
  | "ASSIGNED"
  | "QUOTED"
  | "PAYMENT_PENDING"
  | "PAYMENT_VERIFIED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "DELIVERED"
  | "CANCELLED";

export type GuestSource =
  | "REFERRAL"
  | "FACEBOOK"
  | "WEBSITE"
  | "WHATSAPP"
  | "OTHER";

export interface RequestService {
  id: string;
  name: string;
  price: string;
  requiresQuotation: boolean;
}

export interface AssignedUser {
  id: string;
  name: string;
}

export interface RequestPayment {
  id: string;
  status: string;
  amount: string;
  method: string;
}

export interface ServiceRequest {
  id: string;
  requestNo: string;
  userId: string | null;
  serviceId: string;
  assignedToId: string | null;
  isGuest: boolean;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  guestAddress: string | null;
  guestSource: GuestSource;
  status: RequestStatus;
  formData: Record<string, unknown>;
  userNotes: string | null;
  adminNotes: string | null;
  quotedPrice: string | number | null;
  finalPrice: string | number | null;
  currency: string;
  deliveryMessage: string | null;
  submittedAt: string;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  service: RequestService;
  assignedTo: AssignedUser | null;
  payment: RequestPayment | null;
}