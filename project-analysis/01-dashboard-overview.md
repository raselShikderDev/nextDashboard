# Dashboard Overview
## Admin Workflow
1. **Login**: Navigate to `/login`, enter credentials, POST to `/auth/login`
2. **Dashboard**: After login, redirected to `/dashboard` showing key metrics
3. **Requests Management**:
   - View all requests with filtering/status options
   - Click on request to view details
   - Actions: claim request, approve, start work, mark complete, deliver, cancel
4. **User Management** (Admin only):
## Frontend Authorization
- **Role-Based UI**: Components conditionally render based on userProfile.role
  - ADMIN: See all menus (Users, Services, Settings, etc.)
  - MANAGER: See limited menus (Dashboard, Requests, Payments, Profile)
## API Integration
- **Base URL**: VITE_API_URL from environment (default: http://localhost:5000/api/v1)
- **Credentials**: "include" for cookie-based authentication
- **Tag Types**: User, Request, Payment, Service, Notification, Dashboard, ServiceCategory
- **Automatic Refetching**: Based on tag invalidation after mutations
- **Optimistic Updates**: Not implemented (standard RTK Query behavior)

### Key API Endpoints Used
| Method | Endpoint | Source File | Description |
|--------|----------|-------------|-------------|
| POST | `/auth/login` | src/features/auth/api/authApi.ts | User login |
| POST | `/auth/logout` | src/features/auth/api/authApi.ts | User logout |
## Request Management
- **List View**: DataTable with filtering by status, search, date range
- **Detail View**: Tabs for request info, documents, payment, status history
- **Actions**:
  - Claim Request: Managers can claim unassigned requests
  - Approve Request: Admins can approve requests (sets status to APPROVED)
  - Start Work: Managers/admins can start work (IN_PROGRESS)
  - Mark Complete: Mark as completed (COMPLETED)
  - Deliver: Mark as delivered (DELIVERED)
  - Cancel: Cancel with optional notes (CANCELLED)
- **Status Badges**: Color-coded based on request status

## Document Management
- **Upload**: Not directly exposed in dashboard; handled via request creation flow
- **Listing**: View documents attached to requests in detail view
- **Download**: Links to download documents (presigned S3 URLs from backend)
- **Types**: User uploads, payment proofs, additional documents, final deliveries

## Payment Management
- **List View**: Payment submissions with status filtering
- **Detail View**: Payment information, transaction ID, sender details
- **Actions**:
  - Verify Payment: Mark payment as verified (admin/manager)
  - Reject Payment: Mark payment as rejected with reason
- **Status Indicators**: SUBMITTED, VERIFIED, REJECTED, REFUNDED

## User Management
- **List View**: Users with role filtering, search, status toggling
- **Detail View**: User profile, contact information, role, status
- **Actions**:
  - Create Staff: Form to create new staff users with role assignment
  - Edit User: Update profile information
  - Change Role: ADMIN/SUPER_ADMIN can change user roles
  - Toggle Status: Activate/deactivate user accounts
  - Reset Password: Send password reset email

## Environment Configuration
- **VITE_API_URL**: http://localhost:5000/api/v1 (development)
- **Production**: Can be overridden to production URL
- **SUPER_ADMIN_EMAIL/PASS**: For emergency access (not used in auth flow)
- **No .env file required** for basic operation (uses Vite env variables)
- **CORS Assumptions**: Expects backend to allow credentials from dashboard origin

## Strengths
- Modern React ecosystem with TypeScript safety
- RTK Query provides excellent data fetching and caching
- Modular, feature-based organization
- Comprehensive UI component library (Radix UI)
- Role-based access control at UI level
- Protected routes prevent unauthorized access to pages
- Responsive design with Tailwind CSS
- Realistic mock data for development/testing

## Weaknesses
- Frontend role checks are NOT security controls (backend must enforce)
- No API request cancellation on unmount
- Limited error handling granularity in RTK Query
- No request deduplication for identical queries
- Bundle size could be optimized with code splitting
- No service workers or PWA features

## Unknown Areas
- Exact production build optimization settings
- Detailed testing strategy (unit/integration tests)
- Error boundary implementation completeness
- Accessibility (a11y) compliance verification
- Internationalization (i18n) support
- Performance monitoring and logging

## Important Findings
- Dashboard expects JWT authentication via HTTP-only cookies
- Guest request tracking uses `/track` endpoint with requestNo and email
- Role-based UI rendering matches backend Role enum (USER, MANAGER, ADMIN, SUPER_ADMIN)
- All API calls include credentials for cookie-based auth
- RTK Query provides automatic refetching and cache updates
- Loading states handled via RTK Query's isLoading flags

## Summary
The nextstepDashboard is a comprehensive admin/manager interface built with modern React technologies. It provides role-based access to request management, user administration, service catalog, payment processing, and system monitoring. The dashboard communicates with the backend API via RTK Query using JWT cookie authentication, presenting data in responsive, interactive components. While the frontend implements role-based UI rendering, actual security enforcement must occur at the backend level.
| POST | `/auth/refresh-token` | src/features/auth/api/authApi.ts | Refresh access token |
| GET | `/user/me` | src/features/users/api/usersApi.ts | Get current user profile |
| GET | `/user?params` | src/features/users/api/usersApi.ts | Get users list with filtering |
| POST | `/users` | src/features/users/api/usersApi.ts | Create new user (admin only) |
| PATCH | `/users/:id` | src/features/users/api/usersApi.ts | Update user (admin only) |
| PATCH | `/user/toggle-status/:id` | src/features/users/api/usersApi.ts | Toggle user active status |
| GET | `/requests` | src/features/requests/api/requestsApi.ts | Get requests list with filtering |
| GET | `/requests/:id` | src/features/requests/api/requestsApi.ts | Get request by ID |
| POST | `/requests/create` | src/features/requests/api/requestsApi.ts | Create new service request |
| PATCH | `/requests/:id` | src/features/requests/api/requestsApi.ts | Update request (assign, notes) |
| PATCH | `/requests/claim-request/:id` | src/features/requests/api/requestsApi.ts | Claim unassigned request |
| PATCH | `/requests/${id}/approve` | src/features/requests/api/requestsApi.ts | Approve request (admin) |
| PATCH | `/requests/start-work/:id` | src/features/requests/api/requestsApi.ts | Start work on request |
| PATCH | `/requests/mark-completed/:id` | src/features/requests/api/requestsApi.ts | Mark request as completed |
| PATCH | `/requests/${id}/deliver` | src/features/requests/api/requestsApi.ts | Deliver completed request |
| PATCH | `/requests/cancel/:id` | src/features/requests/api/requestsApi.ts | Cancel request with notes |
| GET | `/track?requestNo=&email=` | src/features/requests/api/requestsApi.ts | Guest request tracking |
| GET | `/services` | src/features/services/api/servicesApi.ts | Get services list |
| GET | `/services/categories` | src/features/services/api/servicesApi.ts | Get service categories |
| POST | `/payment/verify` | src/features/payments/api/paymentsApi.ts | Verify payment submission |
| GET | `/payment` | src/features/payments/api/paymentsApi.ts | Get payments list |
| GET | `/notification` | src/features/notifications/api/notificationsApi.ts | Get notifications |
  - Both see: Dashboard, Requests, Payments, Notifications, Settings (profile only)
- **ProtectedRoute Component**: 
  - Checks `user` exists (authenticated)
  - Checks `requireAdmin` prop for admin-only routes
  - Checks `userProfile?.status === 'blocked'` for blocked accounts
  - Redirects to login if not authenticated
  - Shows "Access Denied" if authenticated but insufficient role
- **Important**: Frontend role checks are UI-only; actual enforcement happens at backend level
   - View list of users with role filtering
   - Create new staff/users
   - Edit user details, change roles, toggle status
5. **Service Management**:
   - View and manage service categories
   - Create/edit services with pricing and form schemas
6. **Payment Tracking**:
   - View payment submissions
   - Verify payments (mark as verified/rejected)
7. **Notifications**: View system notifications for request updates
8. **Settings**: Update profile, change password, security settings

## Manager Workflow
1. **Login**: Same as admin login
2. **Dashboard**: View personal metrics and assigned requests
3. **Requests Management**:
   - View dashboard showing assigned requests
   - Filter requests by status (assigned to me)
   - Claim unassigned requests
   - Update request status: start work → mark complete → deliver
   - Add internal notes (visible to admins/managers only)
   - Cannot approve requests or verify payments (admin-only functions)
4. **Profile**: Update personal information, change password

## Authentication
- **Login**: POST `/auth/login` with email/password → returns access/refresh tokens
- **Token Storage**: HTTP-only cookies via credentials: "include" in fetch
- **Refresh Token**: POST `/auth/refresh-token` using refresh token cookie
- **Logout**: POST `/auth/logout` clears cookies
- **Protected Routes**: Wrapper component checks for auth state and redirects to login
- **Role Checking**: Frontend hides/shows UI elements based on user role from profile
- **Session Persistence**: RTK Query automatically includes credentials in requests
- **Token Refresh**: Automatic refresh via RTK Query when access token expires

## Repository Identification
- **Actual path**: E:\programme\nextstepDashboard
- **Actual purpose**: Admin/Manager Dashboard
- **Technology**: React 18, TypeScript, Redux Toolkit Query, Radix UI, Tailwind CSS, Vite

## Technology Stack
- **Framework**: React 18.2.0
- **Language**: TypeScript ^5.2.2
- **Build Tool**: Vite ^5.1.4
- **UI Framework**: Radix UI primitives + Tailwind CSS
- **State Management**: Redux Toolkit + Redux Toolkit Query (RTK Query)
- **Forms**: React Hook Form v7.51.0 with Zod resolvers
- **Data Visualization**: Recharts v2.12.2
- **Notifications**: Sonner v2.0.7
- **Routing**: React Router DOM v6.22.2
- **Icons**: Lucide React
- **Date Handling**: Date-fns v3.3.1
- **Environment**: Dotenv v17.4.2
- **Animations**: Framer Motion v11.0.6, Tailwind CSS Animate

## Architecture
- Single Page Application (SPA) with React Router for client-side routing
- Feature-based organization in src/features/
- RTK Query for data fetching and caching
- Protected routes with role-based access control
- Modular components with Radix UI primitives
- Centralized API configuration via baseApi.ts

## Project Structure
```
src/
  app/
    baseApi.ts          - RTK Query base configuration
    helpers/            - Utility functions (formatCurrency, formatDate, etc.)
    hooks/              - Custom React hooks (useDebounce, usePagination)
    lib/                - Form builders, payment badge, validators, WhatsApp button
  components/
    ui/                 - Radix UI based components (button, input, dialog, etc.)
    DataTable.tsx       - Reusable data table component
    ConfirmDialog.tsx   - Reusable confirmation dialog
    LoadingSpinner.tsx  - Reusable loading indicator
  features/
    auth/               - Authentication (login, logout, refresh, change password)
    dashboard/           - Dashboard overview page
    requests/           - Request management (list, create, update, claim, approve)
    payments/           - Payment management and tracking
    users/              - User management (CRUD, staff creation)
    services/           - Service and category management
    notifications/      - Notification center
    settings/           - User profile and system settings
  layouts/
    AdminLayout.tsx     - Main layout with sidebar and header
    Header.tsx          - Top navigation with user menu
    Sidebar.tsx         - Collapsible sidebar navigation
    PageWrapper.tsx     - Page container wrapper
  routes/
    index.tsx           - Application routes with protected and public routes
  types/
    enums.ts            - Request status, payment status enums
    auth.types.ts       - Auth related types
    payment.types.ts    - Payment related types
    request.types.ts    - Request related types
    service.types.ts    - Service related types
    index.ts            - Exported type definitions
```

## Routes
- **Public Routes**:
  - `/login` - Login page
  - `/requests/guest` - Guest request tracking (no auth required)

- **Protected Routes** (require authentication):
  - `/` redirects to `/dashboard`
  - `/dashboard` - Overview dashboard with statistics
  - `/requests` - Request management list and filtering
  - `/payments` - Payment tracking and verification
  - `/users` - User management (admin only)
  - `/services` - Service catalog management
  - `/services/categories` - Service category management
  - `/notifications` - Notification center
  - `/settings` - User profile and account settings
  - `/unauthorized` - Access denied page
  - `*` - 404 Not Found page


## User Workflow (Admin/Manager)
1. Navigate to `/login`
2. Enter email and password; POST to `/auth/login` (returns tokens in HttpOnly cookies)
3. On success, redirected to `/dashboard` which calls `/dashboard/stats` (note: backend has no such endpoint — see Unknown Areas)
4. Navigate to `/requests` to see the list
5. Click a request to see detail; trigger actions (claim/approve/start/complete/deliver/cancel)
6. Navigate to `/payments` to verify or reject payment submissions
7. Navigate to `/users` (admin only) to manage users and create staff
8. Navigate to `/services` and `/services/categories` to manage the catalog
9. Logout via `/auth/logout` which clears cookies

## Guest Workflow
1. Navigate to `/requests/guest` (no auth required)
2. Enter requestNo and email
3. Backend validates via `/requests/track?requestNo=&email=`
4. Result displayed (request status, history)

## Authentication
- **Library**: RTK Query `fetchBaseQuery` with `credentials: "include"`
- **Storage**: HttpOnly cookies set by the backend (accessToken, refreshToken) — JWTs are not stored in the dashboard
- **Token Refresh**: On 401, a refresh thunk calls `/auth/refresh-token` to get a new access token, then retries the original request
- **Login Mutation**: POST `/auth/login` with `{ email, password }` body
- **Logout Mutation**: POST `/auth/logout` (clears cookies on the server)
- **Change Password**: POST `/auth/change-password`
- **Forgot Password**: POST `/auth/forgot-password` (sends OTP email)
- **Reset Password**: POST `/auth/reset-password` (requires OTP)

## Request Management
- **List View**: DataTable with filtering by status, search, date range
- **Detail View**: Tabs for request info, documents, payment, status history
- **Actions**:
  - Claim Request: PATCH /requests/claim-request/:id (MANAGER/ADMIN)
  - Assign Manager: PATCH /requests/assign/:id (ADMIN)
  - Set Quotation: PATCH /requests/quotation/:id (ADMIN)
  - Start Work: PATCH /requests/start-work/:id (MANAGER/ADMIN)
  - Mark Complete: PATCH /requests/mark-completed/:id (MANAGER/ADMIN)
  - Deliver: PATCH /requests/:id/deliver (MANAGER/ADMIN)
  - Cancel: PATCH /requests/cancel/:id (ADMIN)
- **Status Badges**: Color-coded based on request status (SUBMITTED, ASSIGNED, IN_PROGRESS, COMPLETED, DELIVERED, CANCELLED)

## Document Management
- **Upload**: POST /document/upload/:requestId with multipart form data (MANAGER/ADMIN)

## Service Management
- **List Services**: GET /services (no auth)
- **Get by Slug**: GET /services/:slug
- **Categories**: GET /services/service-category
- **Create Service**: POST /services/create (ADMIN)
- **Create Category**: POST /services/category-create (ADMIN)
- **Update Service**: PATCH /services/:id (ADMIN)
- **Toggle Status**: PATCH /services/:id/toggle-status (ADMIN)

## User Management
- **List Users**: GET /user (ADMIN)
- **Get User**: GET /user/:id (ADMIN)
- **Create Staff**: POST /user/create-staff (ADMIN)
- **Update Profile**: PATCH /user/update-profile
- **Me**: GET /user/me
- **Toggle Status**: PATCH /user/toggle-status/:id (ADMIN)

## Environment Configuration
- **VITE_API_URL**: http://localhost:5000/api/v1 (development)
- **Production**: Can be overridden to production URL
- **SUPER_ADMIN_EMAIL/PASS**: For emergency access (not used in auth flow)
- **No .env file required** for basic operation (uses Vite env variables)
- **CORS Assumptions**: Expects backend to allow credentials from dashboard origin

## Strengths
- Modern React 18 + TypeScript + Vite stack
- RTK Query provides data caching, tag-based invalidation, and automatic refetching
- Cookie-based auth aligns with the backend's HttpOnly cookie strategy
- Form validation via React Hook Form + Zod resolvers
- Recharts integration for dashboard analytics
- Sonner for toast notifications
- Comprehensive UI primitives via Radix UI

## Weaknesses
- **API Path Mismatches**: `paymentsApi.ts` uses `/payment?` and `/payments/` paths (plural) but backend exposes `/payment/` (singular). `getPaymentById` calls `/payments/${id}` instead of `/payment/${id}`.
- **Missing Dashboard Endpoints**: `dashboardApi.ts` calls `/dashboard/stats`, `/dashboard/revenue`, `/dashboard/user-growth`, `/dashboard/request-trends` — none of these exist in the backend.
- **Hardcoded Feature Limits**: Pagination/filter defaults are sometimes hardcoded rather than configurable.
- **No role guards in routes file beyond admin-only paths**: relies on backend enforcement.
- **No notification controller found in backend routes**: dashboard's `/notifications` page may not function.
- **Document URLs publicly accessible**: `/uploads/*` is statically served by the backend without auth.

## Unknown Areas
- Whether the dashboard's `/notifications` page works (backend has no notification controller)
- The exact analytics endpoints the backend intends to expose
- Whether the dashboard's paymentsApi has been updated to match the backend's singular paths
- Whether the `serviceCategory` and `service` RTK Query endpoints match the backend route ordering
- The shape of `/dashboard/stats` response (no backend endpoint exists to provide it)

## Important Findings
1. **Dashboard is the Admin/Manager frontend** for the nextstep system
2. **It shares auth with the backend via HttpOnly cookies** (correct integration)
3. **It has multiple API path mismatches** with the actual backend route definitions
4. **It calls dashboard analytics endpoints that do not exist** in the backend
5. **It does not handle the guest request creation flow** — guests would need a separate frontend (nextstepUser, if it exists)
6. **The payment API has both singular and plural paths** — likely a refactoring artifact
7. **The dashboard is functional for auth, user, request, and basic payment management** but the analytics and notification features are not wired up end-to-end
- **Listing**: GET /document/request/:requestId returns documents (auth required)
- **Download**: Click on a document opens the URL directly (urls are stored as /uploads/requests/{filename} which is publicly served)
- **Delete**: DELETE /document/:id (ADMIN only)

## Payment Management
- **List View**: GET /payment with status filtering
- **Detail View**: GET /payment/:id shows transaction ID, sender details, screenshot
- **Actions**:
  - Verify: PATCH /payment/verify/:id (ADMIN)
  - Reject: PATCH /payment/reject/:id with reason (ADMIN)
- **Status Badges**: SUBMITTED, VERIFIED, REJECTED, REFUNDED