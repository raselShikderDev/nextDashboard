import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Payment } from "@/types/payment.types";
import { formatCurrency, formatDate } from "@/helpers/helpers";
import {
  CreditCard,
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  ShieldCheck,
  XCircle,
  StickyNote,
  Image as ImageIcon,
} from "lucide-react";

interface PaymentViewCardProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const methodLabels: Record<string, string> = {
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  DUTCH_BANGLA: "Dutch Bangla",
  BANK_TRANSFER: "Bank Transfer",
  CASH: "Cash",
};

const statusColors: Record<string, string> = {
  SUBMITTED: "bg-amber-100 text-amber-700 border-amber-200",
  VERIFIED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
  REFUNDED: "bg-gray-100 text-gray-700 border-gray-200",
};

export function PaymentViewCard({
  payment,
  open,
  onOpenChange,
}: PaymentViewCardProps) {
  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Status & Amount */}
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={`capitalize ${statusColors[payment.status] || ""}`}
            >
              {payment.status.toLowerCase()}
            </Badge>
            <span className="text-2xl font-bold">
              {formatCurrency(Number(payment.amount))}
            </span>
          </div>

          {/* Request Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Request
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Request No:</span>{" "}
                <span className="font-mono font-medium">
                  {payment.request?.requestNo || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Service Status:</span>{" "}
                <span className="capitalize">
                  {payment.request?.status?.toLowerCase() || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Guest / User Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Submitted By
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{payment.request?.guestName || "Guest User"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{payment.request?.guestEmail || "—"}</span>
              </div>
              {payment.senderNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{payment.senderNumber}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Payment Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Transaction Info
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Method:</span>
                <span className="font-medium">
                  {methodLabels[payment.method] || payment.method}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Trx ID:</span>
                <span className="font-mono font-medium">
                  {payment.transactionId}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Submitted:</span>
                <span>{formatDate(payment.submittedAt)}</span>
              </div>
              {payment.verifiedAt && (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span className="text-muted-foreground">Verified:</span>
                  <span>{formatDate(payment.verifiedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Screenshot */}
          {payment.screenshotUrl && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Payment Proof
              </h4>
              <a
                href={payment.screenshotUrl}
                target="_blank"
                rel="noreferrer"
                className="block border rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
              >
                <img
                  src={payment.screenshotUrl}
                  alt="Payment proof"
                  className="w-full h-48 object-cover"
                />
              </a>
              <p className="text-xs text-muted-foreground">
                Click image to open in full size
              </p>
            </div>
          )}

          {/* Notes */}
          {(payment.userNote || payment.adminNote || payment.rejectionReason) && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <StickyNote className="w-4 h-4" />
                Notes
              </h4>
              {payment.userNote && (
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    User Note:
                  </span>{" "}
                  {payment.userNote}
                </div>
              )}
              {payment.adminNote && (
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm">
                  <span className="font-medium text-green-800 dark:text-green-200">
                    Admin Note:
                  </span>{" "}
                  {payment.adminNote}
                </div>
              )}
              {payment.rejectionReason && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm">
                  <span className="font-medium text-red-800 dark:text-red-200">
                    Rejection Reason:
                  </span>{" "}
                  {payment.rejectionReason}
                </div>
              )}
            </div>
          )}

          {/* Verified By */}
          {payment.verifiedBy && (
            <div className="text-sm text-muted-foreground">
              Verified by:{" "}
              <span className="font-medium text-foreground">
                {payment.verifiedBy?.userDetails?.name}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}