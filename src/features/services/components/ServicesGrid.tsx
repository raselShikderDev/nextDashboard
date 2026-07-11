// features/services/components/ServiceCard.tsx
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  CheckCircle2,
  Clock,
  Tag,
  Layers,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Service } from "@/types/service.types";

interface ServiceCardProps {
  service: Service;
  onEdit?: (service: Service) => void;
  onDelete?: (service: Service) => void;
  onToggleStatus?: (service: Service) => void;
}

export function ServiceCard({
  service,
  onEdit,
  onDelete,
  onToggleStatus,
}: ServiceCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeliverables, setShowDeliverables] = useState(false);

  const isActive = service.isActive;

  return (
    <>
      <Card className="group flex flex-col transition-all duration-200 hover:border-border/80 hover:shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-semibold leading-tight">
                  {service.name}
                </h3>
                {service.requiresQuotation && (
                  <Badge variant="outline" className="h-5 text-[10px] font-medium">
                    Quote
                  </Badge>
                )}
              </div>
              {service.category && (
                <p className="text-xs text-muted-foreground">
                  {service.category.name}
                </p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowDetails(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(service)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleStatus?.(service)}>
                  {isActive ? (
                    <>
                      <PowerOff className="mr-2 h-4 w-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Power className="mr-2 h-4 w-4" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(service)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-3 pb-4">
          {/* Price & Status */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold tabular-nums">
              {service.currency} {service.price}
            </span>
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={cn(
                "text-xs",
                isActive &&
                  "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400"
              )}
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Description */}
          {service.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          )}

          {/* Turnaround */}
          {service.turnaround && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{service.turnaround}</span>
            </div>
          )}

          {/* Features */}
          {service.features.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Tag className="h-3.5 w-3.5" />
                Features
              </div>
              <div className="flex flex-wrap gap-1">
                {service.features.map((f, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="h-5 text-[10px] font-normal"
                  >
                    {f}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables */}
          {service.deliverables.length > 0 && (
            <div className="space-y-1.5 border-t border-border/50 pt-2">
              <button
                onClick={() => setShowDeliverables(!showDeliverables)}
                className="flex w-full items-center justify-between text-xs font-medium text-foreground transition-colors hover:text-foreground/80"
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  Deliverables
                </span>
                {showDeliverables ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
              {showDeliverables && (
                <ul className="space-y-1">
                  {service.deliverables.map((d, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-1.5 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-muted-foreground" />
              {service.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold tabular-nums">
                {service.currency} {service.price}
              </span>
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={cn(
                  isActive &&
                    "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400"
                )}
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            {service.category && (
              <p className="text-sm text-muted-foreground">
                Category:{" "}
                <span className="font-medium text-foreground">
                  {service.category.name}
                </span>
              </p>
            )}

            {service.description && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            )}

            {service.turnaround && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Turnaround:{" "}
                <span className="font-medium text-foreground">
                  {service.turnaround}
                </span>
              </div>
            )}

            {service.features.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Features</p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((f, i) => (
                    <Badge key={i} variant="secondary" className="font-normal">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {service.deliverables.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Deliverables</p>
                <ul className="space-y-1.5">
                  {service.deliverables.map((d, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.formSchema && Object.keys(service.formSchema).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Form schema</p>
                <div className="rounded-md bg-muted/50 p-3">
                  <pre className="overflow-x-auto text-xs text-muted-foreground">
                    {JSON.stringify(service.formSchema, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              <span>Sort order: {service.sortOrder}</span>
              <span>
                Created{" "}
                {new Date(service.createdAt).toLocaleDateString("en-GB")}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}