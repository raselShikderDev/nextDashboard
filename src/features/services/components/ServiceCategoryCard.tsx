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
  GraduationCap,
  Briefcase,
  Globe,
  Plane,
  BookOpen,
  FileText,
  Tag,
  Hash,
} from "lucide-react";
import { ServiceCategory } from "@/types/service.types";

interface ServiceCategoryCardProps {
  category: ServiceCategory;
  onEdit?: (category: ServiceCategory) => void;
  onDelete?: (category: ServiceCategory) => void;
  onToggleStatus?: (category: ServiceCategory) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  "graduation-cap": <GraduationCap className="h-5 w-5" />,
  briefcase: <Briefcase className="h-5 w-5" />,
  globe: <Globe className="h-5 w-5" />,
  plane: <Plane className="h-5 w-5" />,
  "book-open": <BookOpen className="h-5 w-5" />,
  "file-text": <FileText className="h-5 w-5" />,
  tag: <Tag className="h-5 w-5" />,
  hash: <Hash className="h-5 w-5" />,
};

export function ServiceCategoryCard({
  category,
  onEdit,
  onDelete,
  onToggleStatus,
}: ServiceCategoryCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const isActive = category.isActive;
  const icon = iconMap[category?.icon!] || <Tag className="h-5 w-5" />;

  return (
    <>
      <Card className="group flex flex-col transition-all duration-200 hover:border-border/80 hover:shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {icon}
                </div>
                <h3 className="truncate text-sm font-semibold leading-tight">
                  {category.name}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">{category.slug}</p>
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
                <DropdownMenuItem onClick={() => onEdit?.(category)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleStatus?.(category)}>
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
                  onClick={() => onDelete?.(category)}
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Hash className="h-3.5 w-3.5" />
              <span>Order: {category.sortOrder}</span>
            </div>
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={cn(
                "text-xs",
                isActive &&
                  "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400",
              )}
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {category.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {category.description}
            </p>
          )}

          <div className="mt-auto pt-2 text-xs text-muted-foreground">
            Created {new Date(category.createdAt).toLocaleDateString("en-GB")}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
              {category.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={cn(
                  isActive &&
                    "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400",
                )}
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Sort order: {category.sortOrder}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Slug
              </p>
              <p className="font-mono text-sm">{category.slug}</p>
            </div>

            {category.description && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Description
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Icon
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {icon}
                </div>
                <span className="font-mono text-xs">{category.icon}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              <span>Created {new Date(category.createdAt).toLocaleDateString("en-GB")}</span>
              <span>Updated {new Date(category.updatedAt).toLocaleDateString("en-GB")}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
