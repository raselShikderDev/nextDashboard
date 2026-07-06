
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Briefcase,
  Banknote,
} from "lucide-react";
import { ServiceRequest } from "@/types/request.types";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { PaymentBadge } from "@/lib/paymentBadge";

interface RequestCardProps {
  request: ServiceRequest;
}

export function RequestCard({ request }: RequestCardProps) {
  const [expanded, setExpanded] = useState(false);

  const submittedDate = new Date(request.submittedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const submittedTime = new Date(request.submittedAt).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:border-border/80 hover:shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="font-mono text-sm font-medium tracking-tight">
              {request.requestNo}
            </p>
            <p className="text-xs text-muted-foreground">
              {submittedDate} · {submittedTime}
            </p>
          </div>
          <RequestStatusBadge status={request.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-3">
        {/* Service & Price */}
        <div className="flex items-center justify-between border-y border-border/50 py-3">
          <span className="text-sm font-medium">{request.service.name}</span>
          <span className="text-sm font-semibold tabular-nums">
            {request.currency} {request.service.price}
          </span>
        </div>

        {/* Guest Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="font-medium">{request.guestName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            <span>{request.guestEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{request.guestPhone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{request.guestAddress}</span>
          </div>
        </div>

        {/* Expandable Details */}
        <div
          className={cn(
            "grid gap-3 overflow-hidden transition-all duration-200",
            expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="min-h-0 space-y-3 border-t border-border/50 pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Source</span>
              <span className="font-medium">{request.guestSource}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Passport</span>
            <span className="font-mono text-xs">{request.formData.passportNumber as string}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Assigned to</span>
              <span className="font-medium">
                {request.assignedTo?.name ?? "Unassigned"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Payment</span>
              <PaymentBadge payment={request.payment} />
            </div>
            {request.payment && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Amount paid</span>
                <span className="font-medium tabular-nums">
                  {request.currency} {request.payment.amount}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-medium">
                {request.completedAt
                  ? new Date(request.completedAt).toLocaleDateString("en-GB")
                  : "—"}
              </span>
            </div>
            {request.userNotes && (
              <div className="rounded-lg border-l-2 border-border bg-muted/40 px-3 py-2 text-sm italic text-muted-foreground">
                “{request.userNotes}”
              </div>
            )}
          </div>
        </div>

        {/* Expand Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {expanded ? (
            <>
              Collapse <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Expand <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </CardContent>
    </Card>
  );
}