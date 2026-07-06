import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { PaymentBadge } from "@/lib/paymentBadge";
import { ServiceRequest } from "@/types/request.types";
import { User, Mail, Phone, MapPin, FileText } from "lucide-react";

interface RequestDetailsModalProps {
  request: ServiceRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestDetailsModal({
  request,
  open,
  onOpenChange,
}: RequestDetailsModalProps) {
  if (!request) return null;

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Request details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Top meta */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm font-medium">
                {request.requestNo}
              </p>
              <p className="text-xs text-muted-foreground">
                {fmt(request.submittedAt)}
              </p>
            </div>
            <RequestStatusBadge status={request.status} />
          </div>

          <Separator />

          {/* Service */}
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Service
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {request.service.name}
              </span>
              <span className="text-sm font-semibold tabular-nums">
                {request.currency} {request.service.price}
              </span>
            </div>
          </div>

          <Separator />

          {/* Guest */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Guest information
            </p>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{request.guestName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{request.guestEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{request.guestPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{request.guestAddress}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Details grid */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Details
            </p>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source</span>
                <span className="font-medium">{request.guestSource}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Passport</span>
                <span className="font-mono text-xs">
                  {String(request.formData.passportNumber)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned to</span>
                <span className="font-medium">
                  {request.assignedTo?.name ?? "Unassigned"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment</span>
                <PaymentBadge payment={request.payment} />
              </div>
              {request.payment && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount paid</span>
                  <span className="font-medium tabular-nums">
                    {request.currency} {request.payment.amount}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">
                  {request.completedAt ? fmt(request.completedAt) : "—"}
                </span>
              </div>
            </div>
          </div>

          {request.userNotes && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Request Creator's Notes
                </p>
                <div className="rounded-lg border-l-2 border-border bg-muted/40 px-3 py-2 text-sm italic text-muted-foreground">
                  “{request?.userNotes}”
                </div>
              </div>
            </>
          )}
          {request?.deliveryMessage && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Assigned Person's Notes
                </p>
                <div className="rounded-lg border-l-2 border-border bg-muted/40 px-3 py-2 text-sm italic text-muted-foreground">
                  “{request?.deliveryMessage}”
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
