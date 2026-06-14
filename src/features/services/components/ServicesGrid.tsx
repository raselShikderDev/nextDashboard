import { Pencil, Trash2, ToggleLeft, ToggleRight, DollarSign, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { formatCurrency, cn } from "../../../lib/utils";
import type { Service } from "../../../types";
import { EmptyState } from "../../../components/EmptyState";

const statusConfig = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200",
  inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200",
  deprecated: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200",
};

interface ServicesGridProps {
  data: Service[]; isLoading: boolean;
  onEdit: (s: Service) => void; onDelete: (s: Service) => void; onToggleStatus: (s: Service) => void;
}

export function ServicesGrid({ data, isLoading, onEdit, onDelete, onToggleStatus }: ServicesGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
            <div className="w-12 h-12 bg-muted rounded-xl mb-4" />
            <div className="h-5 bg-muted rounded w-3/4 mb-2" />
            <div className="h-4 bg-muted rounded w-full mb-4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) return <EmptyState title="No services found" description="No services match your current filters." />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((service, i) => (
        <motion.div key={service.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">{service.icon ?? "📦"}</div>
            <Badge variant="outline" className={cn("text-xs capitalize", statusConfig[service.status])}>{service.status}</Badge>
          </div>
          <h3 className="font-semibold text-base mb-1">{service.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{service.description}</p>
          <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{formatCurrency(service.price)}</span>
            <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />{service.category}</span>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(service)}><Pencil className="w-3.5 h-3.5 mr-1" />Edit</Button>
            <Button variant="outline" size="sm" onClick={() => onToggleStatus(service)} title={service.status === "active" ? "Deactivate" : "Activate"}>
              {service.status === "active" ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete(service)}><Trash2 className="w-3.5 h-3.5" /></Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
