import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Mail, Phone, Shield, Calendar, MapPin, CheckCircle2, XCircle } from "lucide-react";
import type { User } from "../../../types";
import { formatDate, getInitials } from "@/app/helpers/helpers";

interface UserViewCardProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserViewCard({ user, open, onOpenChange }: UserViewCardProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.userDetails?.avatarUrl || ""} />
              <AvatarFallback className="text-lg bg-primary/10 text-primary font-bold">
                {getInitials(user.userDetails?.name || user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">
                {user.userDetails?.name || "Unnamed User"}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 pt-1">
                <Badge
                  variant="outline"
                  className={`capitalize text-xs ${
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-700"
                      : user.role === "MANAGER"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role.toLowerCase()}
                </Badge>
                <Badge
                  variant={user.isActive ? "default" : "secondary"}
                  className={
                    user.isActive
                      ? "bg-green-100 text-green-700 border-green-200"
                      : ""
                  }
                >
                  {user.isActive ? (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Email
              </p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                Phone
              </p>
              <p className="font-medium">{user.userDetails?.phone || "—"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Address
              </p>
              <p className="font-medium">{user.userDetails?.address || "—"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Joined
              </p>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Verified
              </p>
              <p className="font-medium">
                {user.isVerified ? "Yes" : "No"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Must Change Password
              </p>
              <p className="font-medium">
                {user.mustChangePassword ? true : false}
              </p>
            </div>
          </div>

          <Separator />

          {/* Meta */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>User ID: <span className="font-mono">{user.id}</span></p>
            <p>Last Updated: {formatDate(user.updatedAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}