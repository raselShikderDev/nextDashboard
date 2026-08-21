# NextStep Admin Dashboard

Enterprise-grade admin dashboard built with React 19, TypeScript, Vite, Redux Toolkit, RTK Query, ShadCN, Tailwind CSS, Framer Motion, Recharts, React Hook Form, and Zod.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Demo Login

- **Email:** admin@example.com
- **Password:** password123

> The app runs fully in demo mode without a backend — all pages use mock data fallbacks.

## Features

- **Dashboard** — Revenue & user growth charts, stats cards, recent requests
- **Requests** — Full CRUD, approve/reject, status/priority filtering, pagination
- **Payments** — Transaction table, refund flow, summary stats
- **Users** — Create/edit/delete, role management, activate/deactivate
- **Services** — Card grid view, toggle status, CRUD
- **Notifications** — Redux-powered panel + full page, mark read/unread, filter
- **Settings** — Profile, Security (password change, 2FA), Notifications, Appearance

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| State | Redux Toolkit + RTK Query |
| UI | ShadCN + Tailwind CSS |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion |
| Charts | Recharts |
| Routing | React Router v6 |
| Icons | Lucide React |



**Security Design Review – Consolidated Findings**

---

### 1️⃣ Guest token lifecycle  
**Current design (as described in 10‑security‑design‑final.md)**  
- Uses a single “guest” JWT for both upload and download.  
- No explicit scope separation; token can be reused for download automatically.  
- No stated limit on number of uploads per token.  
- No binding to `requestId` or `jti` storage.  

**Recommended precise lifecycle** – **Scoped Short‑Lived Guest Tokens (Option B)**  
| Component | Details |
|-----------|---------|
| **Scope** | Separate `upload` and `download` scopes are encoded in the JWT. |
| **Limited uses** | Upload‑scope token is **single‑use**; a new token is issued for each file (or a max‑5‑uploads‑per‑token limit can be enforced). |
| **Expiration** | `exp` claim set to ~15 min (configurable). |
| **Binding** | JWT contains `requestId` and a unique `jti` (UUID). |
| **Storage** | Only a hashed `jti` + `exp` + `used_at` are persisted in a new **`GuestSession`** model. |
| **Reuse for download** | A still‑valid upload token **cannot** automatically become a download token; a separate `download`‑scoped token must be presented. |
| **Security checks** | Verify existence, non‑expiry, not‑used, and matching `scope`. Mark `used_at` to prevent replay. |

*Current code does **not** implement a `GuestSession` model or any scoped‑token logic – this is a key gap.*

---

### 2️⃣ GuestCode infrastructure  
- The design calls for a **guest verification code** (`guestCode`) generated at request creation and stored on `ServiceRequest`.  
- It must be delivered **out‑of‑band** (email or SMS).  

**Verification:**  
- Code search shows **only references** to `guestCode` in design documents; no implementation found in the repo.  
- The project **does** have **`nodemailer`** and **`otp-generator`** dependencies, but there is **no observable email‑sending or SMS‑sending service** that actually issues a `guestCode`.  

**Conclusion:**  
- **Out‑of‑band delivery is not yet implemented.**  
- This is a **technical dependency** that must be built before the guest‑code flow can be used for ownership proof.

---

### 3️⃣ File validation  
**Current upload configuration (`src/config/upload.ts`)**  
- **Size limit:** 20 MiB (`fileSize: 20 * 1024 * 1024`).  
- **Storage:** Files are stored under `uploads/requests/` with a generated random filename.  
- **Metadata saved:** `mimeType`, `size`, `originalName`, `url` (`/uploads/requests/<filename>`).  

**Missing validation:**  
- No **MIME‑type whitelist enforcement**; only the MIME type is stored, not validated against an allowed list.  
- No **extension whitelist** enforced in code – the design documents list allowed extensions (`.pdf`, `.png`, `.jpg`, `.jpeg`, `.txt`, `.doc`, `.docx`), but the implementation does not check them.  
- No **magic‑byte or content‑type verification** (e.g., PDF header check).  

**Result:**  
- The upload endpoint currently **accepts any file type** up to 20 MiB, which can lead to malicious file uploads.

---

### 4️⃣ Manager authorization  
- Managers currently access endpoints via **JWT + `authCheck`** middleware that checks for roles `MANAGER`, `ADMIN`, `SUPER_ADMIN`.  
- No **manager‑specific token** is required; the existing JWT is sufficient as long as the role check filters by `assignedToId` (or other business‑rule filters).  

**Design recommendation:**  
- Continue using the **existing JWT** with role‑based middleware; add **least‑privilege filters** (e.g., `assignedToId === callerId`) if the policy is “assigned‑only”.  

**No extra token type is needed.**

---

### 5️⃣ Guest ownership  
- **Guest request creation** currently stores `guestCode` on `ServiceRequest` (field exists but is nullable and not auto‑generated).  
- The request flow does **not** automatically bind a newly created `ServiceRequest` to a `guestCode`.  
- `guestCode` is **public‑identifiable** (`requestId`, `guestEmail`, `guestPhone`) and must be paired with a **valid token** to prove ownership.  

**Implication:**  
- The concept is sound, but the **actual generation and delivery mechanism is missing**; adding it will affect request creation, tracking, and frontend forms that rely on the current public IDs.

---

### 6️⃣ `RequestDocument` model & migration  
**Prisma schema (`prisma/schema.prisma`)**  

```prisma
model RequestDocument {
  id           String   @id @default(uuid())
  requestId    String?  // currently nullable
  uploadedById String?  // currently nullable
  // … other fields …
  request      ServiceRequest? @relation(fields: [requestId], references: [id], onDelete: Cascade)
  uploadedBy   UserDetails? @relation(fields: [uploadedById], references: [id])
}
```

- **`requestId` is nullable** → orphan `RequestDocument` rows are possible.  
- **`uploadedById` is nullable** → no strict owner link.  
- The model already defines a **relation to `ServiceRequest`** (`request` relation).  

**Migration notes:**  
- To make `requestId` **non‑nullable**, first **remove or orphan** existing documents or move them to a quarantine area, then add a **foreign‑key constraint**.  
- A **cleanup job** is needed to associate orphan documents with a valid request or delete them.  

**Current implementation allows orphan documents**; this must be resolved before the schema change.

---

### 7️⃣ Private storage & public exposure  
- **Upload directory:** `path.join(process.cwd(), "uploads", "requests")`.  
- **Static serving:** `app.ts` contains `expressApp.use("/uploads", express.static(path.join(process.cwd(), "uploads")));`.  
- **URL generation** in services: URLs are stored as `/uploads/requests/<filename>` and returned to the client.  
- **Frontend dependency:** Several UI components reference `/uploads/...` URLs directly.  

**Effect of removal:**  
- Removing the static mount will **break any existing client code that expects a public `/uploads/...` URL**.  
- A **protective endpoint** (`/api/v1/documents/:id`) must be introduced to serve files **after** authorisation checks.  
- A **migration plan** (e.g., 301 redirects or a static‑mapping service) is required to preserve bookmarked URLs.

---

### 8️⃣ Manager / Admin authentication  
- Authentication flow uses **JWT** created/verified in `src/utils/jwtHelper.ts`.  
- Role checks are performed via `authCheck(Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)` middleware.  
- No separate manager‑only token is required; the existing token plus role authorisation suffices.  

**Conclusion:**  
- The current JWT + middleware approach **covers manager and admin needs**; no extra token type is required.

---

### 9️⃣ Refresh‑token hardening  
- Current flow (in `auth.service.ts`) issues **access** and **refresh** tokens but **does not rotate** or **revoke** old refresh tokens.  
- The design proposes:  
  1. **`tokenVersion`** field on `UserDetails`.  
  2. **`RevokedToken`** model to store used/black‑listed refresh tokens.  
  3. **15‑minute access‑token TTL**.  
  4. **Rotation on each use** – new refresh token issued, previous one revoked.  

- **Implementation status:** None of these components exist yet.  

**Result:** Minimal safe refresh‑token hardening is **not yet implemented**.

---

### 🔟 Rate limiting  
- A **global Redis‑backed rate limiter** (`src/middleware/globalRateLimiter.ts`) is present, with a default of **100 points per 60 s**.  
- The design documents reference **route‑specific limits** (e.g., `5 uploads per hour per token`).  
- Current rate‑limiter is **global**, not per‑route; no documented per‑endpoint configuration.  

**Missing:** explicit **per‑route limits** for upload, track, and document endpoints.

---

### 1️⃣1️⃣ Security architecture (final view)  

```
Guest Request
   │
   ├─► GuestCode (out‑of‑band verification) ──► Token issuance (upload‑scope JWT)
   │        │                                 │
   │        └─► Validation at upload endpoint │
   │                                          │
   ├─► File validation (MIME, size, whitelist)│
   │                                          │
   └─► Private storage (outside public root)  │
                                          │
   ↓                                         │
RequestDocument (linked via requestId)  ←──  Uploaded file metadata
                                          │
   ↓                                         │
Authorized Document Retrieval (download‑scope JWT) → Stream from private storage
```

**Manager Flow**  
- Existing JWT → Role‑based `authCheck` → Optional `assignedToId` filter (policy decision).  

**Admin Flow**  
- Existing JWT + role → Direct access to all requests (business‑level decision).  

All flows rely on **scoped JWTs**, **request‑document linkage**, and **private storage** behind an authenticated endpoint.

---

### 1️⃣2️⃣ Final contradictions table  

| Issue | Current Design | Problem | Corrected Design |
|-------|----------------|---------|------------------|
| Guest token scope | Single JWT used for upload & download | Allows automatic scope conversion; no usage limits | Separate `upload` and `download` JWTs, upload token single‑use, max 5 uploads per token, explicit scope checking |
| GuestCode delivery | Referenced only in design | No code to generate or send `guestCode` | Implement generation, store on `ServiceRequest`, deliver via email/SMS (new service) |
| File validation | Size limit only; no MIME/extension check | Malicious file upload possible | Add Zod schema: allowed extensions, MIME types, magic‑byte check, reject executables |
| Manager authorization | Role check only | No enforcement of “assigned‑only” policy | Add filter `assignedToId === callerId` (or explicit policy flag) |
| `RequestDocument.requestId` | Nullable → orphans allowed | Potential orphaned files & DB rows | After orphan cleanup, make `requestId` required; enforce FK constraint |
| Static file exposure | `express.static('/uploads')` | Public URLs bypass auth | Remove static mount; serve via authenticated `/api/v1/documents/:id` |
| Refresh‑token handling | No rotation/revocation | Stolen tokens remain valid | Introduce `tokenVersion`, `RevokedToken` table, 15‑min access tokens, rotation on each use |
| Rate limiting | Global limiter only | No per‑endpoint limits (e.g., upload) | Add route‑specific limits (e.g., 5 uploads/hr per token) |
| GuestCode infrastructure | Not implemented | Ownership proof missing | Build out‑of‑band delivery service (email/SMS) and validation at upload |

---

### 1️⃣3️⃣ Final implementation readiness  

**Assessment:**  
Multiple **critical blockers** remain:

1. **GuestCode generation & out‑of‑band delivery** – no existing service.  
2. **Scoped short‑lived guest tokens** – `GuestSession` model and JWT issuance not present.  
3. **File validation** – MIME/extension whitelisting, magic‑byte checks absent.  
4. **Orphan document migration** – `requestId` must become non‑nullable only after clean‑up script.  
5. **Static file exposure removal** – requires new authenticated endpoint & URL migration.  
6. **Refresh‑token hardening** – token versioning, revocation, rotation not implemented.  
7. **Per‑route rate limiting** – not configured.  

Until these gaps are filled, **code changes are required** and **security guarantees are incomplete**.

**Conclusion:**  

```
NOT READY FOR IMPLEMENTATION
```

**Key decisions / technical issues that block implementation:**  
- Missing **GuestCode generation & delivery** (email/SMS service).  
- Absence of **GuestSession model** and **scoped JWT** issuance/validation.  
- No **MIME/extension validation** in upload pipeline.  
- Orphan `RequestDocument` handling not completed; `requestId` cannot be made required yet.  
- Static `/uploads` exposure must be removed; new protected endpoint design needed.  
- Refresh‑token revocation & versioning not present.  
- Rate‑limiting limits defined per route are absent.  

Addressing the items above is mandatory before any production‑ready code changes can be merged.  

---  

*End of review.*  

NOT READY FOR IMPLEMENTATION