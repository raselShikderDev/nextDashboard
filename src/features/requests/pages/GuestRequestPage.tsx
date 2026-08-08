// src/features/requests/pages/GuestRequestPage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Loader2,
  ArrowLeft,
  ClipboardList,
  Search,
  Package,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { RequestForm } from "../components/RequestForm";
import { useGetAllServicesQuery } from "@/features/services/api/servicesApi";
import { useCreateRequestMutation, useLazyGetRequestByNoQuery } from "../api/requestsApi";
import { Service } from "@/types/service.types";
import type { RequestFormData } from "../../../lib/validators";
import { toast } from "sonner";

export function GuestRequestPage() {
  const { data: servicesData, isLoading: isServicesLoading } =
    useGetAllServicesQuery({});
  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();
  const [trackRequest, { data: trackedRequest, isFetching: isTracking }] =
    useLazyGetRequestByNoQuery();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<any | null>(null);
  const [trackNo, setTrackNo] = useState("");
  const [trackEmail, setTrackEmail] = useState("");

  const services = servicesData?.data ?? [];

  const handleOpenGeneralForm = () => {
    setSelectedService(null); // ✅ no service pre-selected
    setIsFormOpen(true);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: RequestFormData) => {
    try {
      const result = await createRequest(formData).unwrap();
      setSubmittedRequest(result);
      setIsFormOpen(false);
      toast.success("Request submitted successfully!");
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to submit request. Please try again."
      );
    }
  };

  const handleTrack = async () => {
    if (!trackNo.trim() || !trackEmail.trim()) {
      toast.error("Please enter both request number and email");
      return;
    }
    await trackRequest({ requestNo: trackNo, email: trackEmail });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedService(null);
  };

  // ─── SUCCESS STATE ─────────────────────────────
  if (submittedRequest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card border rounded-2xl shadow-sm p-8 text-center space-y-6"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Request Submitted!</h2>
            <p className="text-muted-foreground">
              We've received your request and will contact you shortly.
            </p>
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-3 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Request Number</span>
              <span className="font-mono font-semibold">
                {submittedRequest.requestNo}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium">
                {submittedRequest.service?.name || "General Request"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">
                {submittedRequest.guestEmail}
              </span>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium mb-1">Save your request number!</p>
            <p>
              Use <strong>{submittedRequest.requestNo}</strong> to track your
              request status. We will also send updates to your email.
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSubmittedRequest(null);
              setSelectedService(null);
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Submit Another Request
          </Button>
        </motion.div>
      </div>
    );
  }

  // ─── MAIN PAGE ─────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Hero / Tracking Section */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold tracking-tight">
              NextStep Services
            </h1>
            <p className="text-muted-foreground text-lg">
              Submit a service request or track your existing one. No account
              required.
            </p>
          </div>

          {/* Tracking Form */}
          <div className="bg-background border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Track Your Request
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Request Number (e.g. NSX-2026-000001)"
                value={trackNo}
                onChange={(e) => setTrackNo(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email used in request"
                value={trackEmail}
                onChange={(e) => setTrackEmail(e.target.value)}
              />
              <Button
                onClick={handleTrack}
                disabled={isTracking}
                className="sm:w-auto w-full"
              >
                {isTracking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Track
                  </>
                )}
              </Button>
            </div>

            Tracking Result 
            {trackedRequest && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="border rounded-lg p-4 bg-muted/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {trackedRequest.service?.name || "General Request"}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      trackedRequest.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : trackedRequest.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {trackedRequest.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Request No:</span>{" "}
                    <span className="font-mono">{trackedRequest.requestNo}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Submitted:</span>{" "}
                    {new Date(trackedRequest.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {trackedRequest.deliveryMessage && (
                  <p className="text-sm bg-green-50 text-green-800 p-2 rounded">
                    <strong>Update:</strong> {trackedRequest.deliveryMessage}
                  </p>
                )}
              </motion.div>
            )}
          </div>

          {/* General Request CTA */}
          <div className="mt-8 text-center">
            <Button size="lg" onClick={handleOpenGeneralForm}>
              <Package className="w-5 h-5 mr-2" />
              Submit a Service Request
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Not sure which service? Click above and we'll help you.
            </p>
          </div>
        </div>
      </div>

      {/* Service Catalog */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Or choose a specific service</h2>

        {isServicesLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No services available</p>
            <p>Please check back later.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service: Service, i: number) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-card border rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    {service.requiresQuotation ? (
                      <span className="text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full font-medium">
                        Quote Required
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-primary">
                        ৳{service.price}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>

                  {service.features && service.features.length > 0 && (
                    <ul className="text-sm space-y-1">
                      {service.features.slice(0, 3).map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <span className="w-1 h-1 rounded-full bg-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button
                    className="w-full mt-2"
                    onClick={() => handleServiceSelect(service)}
                  >
                    Request This Service
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Request Form Dialog */}
      <RequestForm
        open={isFormOpen}
        onOpenChange={handleCloseForm}
        onSubmit={handleSubmit}
        defaultValues={
          selectedService
            ? { serviceId: selectedService.id }
            : { serviceId: "" }
        }
        isLoading={isCreating}
        mode="create"
      />
    </div>
  );
}


// import { useState } from "react";
// import { motion } from "framer-motion";
// import { CheckCircle, Loader2, ArrowLeft, ClipboardList } from "lucide-react";
// import { Button } from "../../../components/ui/button";
// import { RequestForm } from "../components/RequestForm";
// import { useGetAllServicesQuery } from "@/features/services/api/servicesApi";
// import { useCreateRequestMutation } from "../api/requestsApi";
// import { Service } from "@/types/service.types";
// import type { RequestFormData } from "../../../lib/validators";
// import { toast } from "sonner";

// export function GuestRequestPage() {
//   const { data: servicesData, isLoading: isServicesLoading } =
//     useGetAllServicesQuery({});
//   const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();

//   const [selectedService, setSelectedService] = useState<Service | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [submittedRequest, setSubmittedRequest] = useState<any | null>(null);

//   const services = servicesData?.data ?? [];

//   const handleServiceSelect = (service: Service) => {
//     setSelectedService(service);
//     setIsFormOpen(true);
//   };

//   const handleSubmit = async (formData: RequestFormData) => {
//     try {
//       const result = await createRequest(formData).unwrap();
//       setSubmittedRequest(result);
//       setIsFormOpen(false);
//       toast.success("Request submitted successfully!");
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Failed to submit request. Please try again.");
//     }
//   };

//   const handleCloseForm = () => {
//     setIsFormOpen(false);
//     setSelectedService(null);
//   };

//   // ─── SUCCESS STATE ─────────────────────────────
//   if (submittedRequest) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center p-4">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="max-w-md w-full bg-card border rounded-2xl shadow-sm p-8 text-center space-y-6"
//         >
//           <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
//             <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
//           </div>

//           <div className="space-y-2">
//             <h2 className="text-2xl font-bold">Request Submitted!</h2>
//             <p className="text-muted-foreground">
//               We've received your request and will contact you shortly.
//             </p>
//           </div>

//           <div className="bg-muted rounded-lg p-4 space-y-3">
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Request Number</span>
//               <span className="font-mono font-semibold">
//                 {submittedRequest.requestNo}
//               </span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Service</span>
//               <span className="font-medium">{submittedRequest.service?.name}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Email</span>
//               <span className="font-medium">{submittedRequest.guestEmail}</span>
//             </div>
//           </div>

//           <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200">
//             <p className="font-medium mb-1">Save your request number!</p>
//             <p>
//               Use <strong>{submittedRequest.requestNo}</strong> to track your
//               request status. We will also send updates to your email.
//             </p>
//           </div>

//           <Button
//             variant="outline"
//             className="w-full"
//             onClick={() => {
//               setSubmittedRequest(null);
//               setSelectedService(null);
//             }}
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Submit Another Request
//           </Button>
//         </motion.div>
//       </div>
//     );
//   }

//   // ─── SERVICE CATALOG ─────────────────────────────
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="border-b bg-card">
//         <div className="max-w-6xl mx-auto px-4 py-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold tracking-tight">
//                 Request a Service
//               </h1>
//               <p className="text-muted-foreground mt-1">
//                 Select a service below and fill out the form. No account needed.
//               </p>
//             </div>
//             <Button variant="outline" asChild>
//               <a href="/track">Track Existing Request</a>
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-4 py-8">
//         {isServicesLoading ? (
//           <div className="flex h-64 items-center justify-center">
//             <Loader2 className="w-8 h-8 animate-spin text-primary" />
//           </div>
//         ) : services.length === 0 ? (
//           <div className="text-center py-16 text-muted-foreground">
//             <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
//             <p className="text-lg font-medium">No services available</p>
//             <p>Please check back later.</p>
//           </div>
//         ) : (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {services.map((service: Service, i: number) => (
//               <motion.div
//                 key={service.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.05 }}
//                 className="group relative bg-card border rounded-xl p-6 hover:shadow-md transition-shadow"
//               >
//                 <div className="space-y-3">
//                   <div className="flex items-start justify-between">
//                     <h3 className="text-lg font-semibold">{service.name}</h3>
//                     {service.requiresQuotation ? (
//                       <span className="text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full font-medium">
//                         Quote Required
//                       </span>
//                     ) : (
//                       <span className="text-sm font-semibold text-primary">
//                         ৳{service.price}
//                       </span>
//                     )}
//                   </div>

//                   <p className="text-sm text-muted-foreground line-clamp-2">
//                     {service.description}
//                   </p>

//                   {service.features && service.features.length > 0 && (
//                     <ul className="text-sm space-y-1">
//                       {service.features.slice(0, 3).map((f) => (
//                         <li key={f} className="flex items-center gap-2 text-muted-foreground">
//                           <span className="w-1 h-1 rounded-full bg-primary" />
//                           {f}
//                         </li>
//                       ))}
//                     </ul>
//                   )}

//                   <Button
//                     className="w-full mt-2"
//                     onClick={() => handleServiceSelect(service)}
//                   >
//                     Request This Service
//                   </Button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Request Form Dialog */}
//       <RequestForm
//         open={isFormOpen}
//         onOpenChange={handleCloseForm}
//         onSubmit={handleSubmit}
//         defaultValues={
//           selectedService
//             ? {
//                 serviceId: selectedService.id,
//               }
//             : undefined
//         }
//         isLoading={isCreating}
//         mode="create"
//       />
//     </div>
//   );
// }