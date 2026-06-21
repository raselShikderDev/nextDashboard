import {
  Users,
  FileText,
  CreditCard,
  DollarSign,
  Clock,
  Package,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "../../../components/PageHeader";
import { StatsCard } from "../components/StatsCard";
import { RevenueChart } from "../components/RevenueChart";
import { UserGrowthChart } from "../components/UserGrowthChart";
import { RecentRequests } from "../components/RecentRequests";
import {
  useGetDashboardStatsQuery,
  useGetRevenueDataQuery,
  useGetUserGrowthDataQuery,
} from "../api/dashboardApi";
import { useGetRequestsQuery } from "../../requests/api/requestsApi";
import { PageWrapper } from "../../../layouts/PageWrapper";
import type { RevenueData, UserGrowthData } from "../../../types";
import { ServiceRequest } from "@/types/request.types";

const MOCK_STATS = {
  totalUsers: 2438,
  totalRequests: 18342,
  totalPayments: 14200,
  totalRevenue: 842500,
  pendingRequests: 127,
  pendingPayments: 43,
  activeServices: 24,
  userGrowth: 12.5,
  revenueGrowth: 8.3,
  requestGrowth: -2.1,
};

const MOCK_REVENUE: RevenueData[] = [
  { month: "Jan", revenue: 62000, expenses: 38000 },
  { month: "Feb", revenue: 71000, expenses: 42000 },
  { month: "Mar", revenue: 68000, expenses: 40000 },
  { month: "Apr", revenue: 84000, expenses: 45000 },
  { month: "May", revenue: 92000, expenses: 50000 },
  { month: "Jun", revenue: 88000, expenses: 48000 },
  { month: "Jul", revenue: 97000, expenses: 53000 },
  { month: "Aug", revenue: 105000, expenses: 58000 },
  { month: "Sep", revenue: 112000, expenses: 60000 },
  { month: "Oct", revenue: 98000, expenses: 55000 },
  { month: "Nov", revenue: 120000, expenses: 65000 },
  { month: "Dec", revenue: 135000, expenses: 72000 },
];

const MOCK_GROWTH = [
  { month: "Jan", users: 180, active: 120 },
  { month: "Feb", users: 210, active: 160 },
  { month: "Mar", users: 195, active: 145 },
  { month: "Apr", users: 250, active: 200 },
  { month: "May", users: 285, active: 230 },
  { month: "Jun", users: 260, active: 210 },
];

const MOCK_REQUESTS: ServiceRequest[] = Array.from({ length: 6 }, (_, i) => ({
  id: `req-${i}`,
  requestNo: `NSX-2026-${String(i + 1).padStart(6, "0")}`,
  userId: null,
  serviceId: `service-${i}`,
  assignedToId: `admin-${i}`,
  isGuest: true,
  guestName: [
    "Alice Johnson",
    "Bob Smith",
    "Carol White",
    "David Lee",
    "Eva Martinez",
    "Frank Brown",
  ][i],
  guestEmail: `user${i}@example.com`,
  guestPhone: `0170000000${i}`,
  guestAddress: "Dhaka",
  guestSource: "REFERRAL",
  status: (
    [
      "SUBMITTED",
      "PAYMENT_PENDING",
      "PAYMENT_VERIFIED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ] as const
  )[i],
  formData: { passportNumber: `P12345${i}` },
  userNotes: "Need urgent processing",
  adminNotes: null,
  quotedPrice: null,
  finalPrice: null,
  currency: "BDT",
  deliveryMessage: null,
  submittedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
  dueDate: null,
  completedAt: null,
  createdAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  service: {
    id: `service-${i}`,
    name: [
      "APS Certificate",
      "Student Visa",
      "Blocked Account",
      "University Application",
      "Accommodation",
      "Insurance",
    ][i],
    price: String((i + 1) * 5000),
    requiresQuotation: false,
  },
  assignedTo: {
    id: `admin-${i}`,
    name: "Super Admin",
  },
  payment: {
    id: `payment-${i}`,
    status: "VERIFIED",
    amount: String((i + 1) * 5000),
    method: "BKASH",
  },
}));

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: revenue, isLoading: revenueLoading } = useGetRevenueDataQuery(
    {},
  );
  const { data: growth, isLoading: growthLoading } = useGetUserGrowthDataQuery(
    {},
  );
  const { data: requests, isLoading: requestsLoading } = useGetRequestsQuery({
    limit: 6,
  });

  const displayStats = stats ?? MOCK_STATS;
  const displayRevenue = revenue ?? MOCK_REVENUE;
  const displayGrowth = growth ?? MOCK_GROWTH;
  const displayRequests = requests ?? MOCK_REQUESTS;
  console.log({ displayRequests });
  console.log({ "requests?.data": requests });

  return (
    <PageWrapper>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening today."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Users"
          value={displayStats.totalUsers}
          growth={displayStats.userGrowth}
          icon={Users}
          color="blue"
          index={0}
        />
        <StatsCard
          title="Total Requests"
          value={displayStats.totalRequests}
          growth={displayStats.requestGrowth}
          icon={FileText}
          color="purple"
          index={1}
        />
        <StatsCard
          title="Total Revenue"
          value={displayStats.totalRevenue}
          growth={displayStats.revenueGrowth}
          icon={DollarSign}
          format="currency"
          color="green"
          index={2}
        />
        <StatsCard
          title="Payments"
          value={displayStats.totalPayments}
          icon={CreditCard}
          color="orange"
          index={3}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Pending Requests"
          value={displayStats.pendingRequests}
          icon={Clock}
          color="orange"
          index={4}
        />
        <StatsCard
          title="Active Services"
          value={displayStats.activeServices}
          icon={Package}
          color="blue"
          index={5}
        />
        <StatsCard
          title="Pending Payments"
          value={displayStats.pendingPayments}
          icon={AlertCircle}
          color="red"
          index={6}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart
            data={displayRevenue}
            isLoading={revenueLoading && !revenue}
          />
        </div>
        <div>
          <UserGrowthChart
            data={displayGrowth}
            isLoading={growthLoading && !growth}
          />
        </div>
      </div>
      <RecentRequests
        requests={displayRequests as ServiceRequest[]}
        isLoading={requestsLoading && !requests}
      />
    </PageWrapper>
  );
}
