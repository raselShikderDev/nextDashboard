import { ServiceRequest } from "./request.types";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;

  services?: Service[];
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  features: string[];
  deliverables: string[];
  turnaround: string | null;
  price: string;
  currency: string;
  requiresQuotation: boolean;
  formSchema: Record<string, any>;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  category?: ServiceCategory;
  requests?: ServiceRequest[];
}