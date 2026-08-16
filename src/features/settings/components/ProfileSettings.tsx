import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Camera, Mail, Pencil, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { profileSchema, type ProfileFormData } from "../../../lib/validators";
import { useAppDispatch, useAppSelector } from "../../../app/hooks"; // ✅ added useAppSelector
import { updateUser } from "../../auth/slice/authSlice";
import { useToast } from "../../../hooks/useToast";
import {
  useRequestEmailChangeMutation,
  useUpdateProfileMutation,
} from "@/features/users/api/usersApi";
import { getInitials } from "@/helpers/helpers";

export function ProfileSettings() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // ✅ Read from Redux
  const user = useAppSelector((s) => s.auth.user);

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [requestEmailChange, { isLoading: isRequestingEmail }] =
    useRequestEmailChangeMutation();

  const [showEmailForm, setShowEmailForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "" },
  });

  useEffect(() => {
    if (user?.userDetails) {
      reset({
        name: user.userDetails.name ?? "",
        phone: user.userDetails.phone ?? "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const result = await updateProfile(data).unwrap();
      dispatch(updateUser(result.data));
      toast({ title: "Profile updated successfully" });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: err?.data?.message || "Please try again",
      });
    }
  };

  const handleEmailChangeRequest = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const requestedEmail = (
      form.elements.namedItem("requestedEmail") as HTMLInputElement
    ).value;
    const reason = (form.elements.namedItem("reason") as HTMLTextAreaElement)
      .value;

    if (!requestedEmail) return;

    try {
      await requestEmailChange({ requestedEmail, reason }).unwrap();
      toast({ title: "Email change request submitted for admin approval" });
      setShowEmailForm(false);
      form.reset();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Request failed",
        description:
          err?.data?.message || "Could not submit email change request",
      });
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold">Profile Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your personal information. Email changes require admin
          approval.
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user?.userDetails?.avatarUrl || ""} />
            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
           
                {getInitials(
                                user?.userDetails?.name ||
                                  user?.userDetails?.name ||
                                  "User",
                              )}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
            onClick={() => toast({ title: "Avatar upload coming soon" })}
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <p className="font-medium">{user?.userDetails?.name || "—"}</p>
          <p className="text-sm text-muted-foreground capitalize">
            {user?.role}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Your name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="+880 1XXX-XXXXXX"
              {...register("phone")}
            />
          </div>
        </div>

        <Button type="submit" disabled={!isDirty || isUpdating}>
          {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </form>

      {/* Email Section */}
      <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <p className="text-sm text-muted-foreground">
              {user?.email || "—"}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowEmailForm((v) => !v)}
          >
            {showEmailForm ? (
              <X className="w-4 h-4 mr-1" />
            ) : (
              <Pencil className="w-4 h-4 mr-1" />
            )}
            {showEmailForm ? "Cancel" : "Request Change"}
          </Button>
        </div>

        {showEmailForm && (
          <form
            onSubmit={handleEmailChangeRequest}
            className="space-y-3 border-t pt-3"
          >
            <div className="space-y-2">
              <Label htmlFor="requestedEmail">New Email Address</Label>
              <Input
                id="requestedEmail"
                name="requestedEmail"
                type="email"
                placeholder="newemail@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea
                id="reason"
                name="reason"
                rows={2}
                placeholder="Why do you want to change your email?"
              />
            </div>
            <Button type="submit" size="sm" disabled={isRequestingEmail}>
              {isRequestingEmail && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Submit for Approval
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2, Camera } from "lucide-react";
// import { Button } from "../../../components/ui/button";
// import { Input } from "../../../components/ui/input";
// import { Label } from "../../../components/ui/label";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "../../../components/ui/avatar";
// import { profileSchema, type ProfileFormData } from "../../../lib/validators";
// import { useAppSelector, useAppDispatch } from "../../../app/hooks";
// import { updateUser } from "../../auth/slice/authSlice";
// import { useToast } from "../../../hooks/useToast";
// import { useState } from "react";
// import { getInitials } from "@/app/helpers/helpers";

// export function ProfileSettings() {
//   const dispatch = useAppDispatch();
//   const user = useAppSelector((s) => s.auth.user);
//   const { toast } = useToast();
//   const [isSaving, setIsSaving] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isDirty },
//   } = useForm<ProfileFormData>({
//     resolver: zodResolver(profileSchema),
//     defaultValues: {
//       name: user?.userDetails.name ?? "",
//       email: user?.email ?? "",
//       phone: user?.userDetails?.phone ?? "",
//     },
//   });

//   const onSubmit = async (data: ProfileFormData) => {
//     setIsSaving(true);
//     await new Promise((r) => setTimeout(r, 800));
//     dispatch(updateUser(data));
//     toast({ title: "Profile updated successfully" });
//     setIsSaving(false);
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-lg font-semibold">Profile Information</h2>
//         <p className="text-sm text-muted-foreground mt-1">
//           Update your account details and personal information.
//         </p>
//       </div>
//       <div className="flex items-center gap-4">
//         <div className="relative">
//           <Avatar className="w-20 h-20">
//             <AvatarImage src={user?.userDetails.avatarUrl || ""} />
//             <AvatarFallback className="text-xl bg-primary text-primary-foreground">
//               {user ? getInitials(user?.userDetails.name) : "?"}
//             </AvatarFallback>
//           </Avatar>
//           <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
//             <Camera className="w-3.5 h-3.5" />
//           </button>
//         </div>
//         <div>
//           <p className="font-medium">{user?.userDetails.name}</p>
//           <p className="text-sm text-muted-foreground capitalize">
//             {user?.role}
//           </p>
//         </div>
//       </div>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label>Full Name</Label>
//             <Input {...register("name")} />
//             {errors.name && (
//               <p className="text-xs text-destructive">{errors.name.message}</p>
//             )}
//           </div>
//           <div className="space-y-2">
//             <Label>Email Address</Label>
//             <Input type="email" {...register("email")} />
//             {errors.email && (
//               <p className="text-xs text-destructive">{errors.email.message}</p>
//             )}
//           </div>
//           <div className="space-y-2">
//             <Label>Phone Number</Label>
//             <Input placeholder="+1 234 567 890" {...register("phone")} />
//           </div>
//         </div>
//         <Button type="submit" disabled={!isDirty || isSaving}>
//           {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//           Save Changes
//         </Button>
//       </form>
//     </div>
//   );
// }
