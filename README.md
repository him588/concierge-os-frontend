# ConciergeOS Frontend

Frontend for **ConciergeOS** — a hotel property management platform that helps hoteliers manage rooms, services, staff, bookings, and payments from a single dashboard. The app also ships an embeddable booking widget that hotels can add to their own websites.

Built with **Next.js 16** (App Router), **React 19**, and **TypeScript**.

---

## Features

### Public

| Area | Description |
|------|-------------|
| **Landing page** (`/`) | Marketing site with hero, feature highlights, team section, and a live booking widget preview |
| **Authentication** (`/login`) | Email/password sign-in and sign-up with OTP verification, plus Google OAuth |
| **Onboarding** (`/onboarding`) | Four-step wizard to register a new property (type, details, preview, confirmation) |
| **Guest payments** (`/payment/[id]`) | Token-based payment flow for room and service bookings via Razorpay |

### Dashboard (`/overview`, `/rooms`, `/services`, `/profile`)

| Module | Description |
|--------|-------------|
| **Overview** | Booking stats, revenue charts, service heatmap, latest bookings, and quick actions |
| **Rooms** | Create room types and individual rooms, view availability grid, manage categories, and book reservations |
| **Services** | Manage hotel services and sub-services; toggle active/inactive; assign staff to services |
| **Staff** | Create and manage staff members; map staff to services |
| **Profile** | View and edit property details; copy embed snippets for the booking widget (HTML, PHP, WordPress, Next.js, Vue, React) |

### Booking widget

Hotels embed a script on their website to offer direct bookings. The widget is loaded from `https://widget.conciergeservice.in/widget.js` and mounted via a `data-booking-widget` element with `data-hotel-id` and `data-hotel-name` attributes.

A local dev harness is included in `widget-dev.html` for testing widget integration outside the main app.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, standalone output) |
| UI | React 19, Tailwind CSS 4, DaisyUI |
| Data fetching | TanStack React Query v5 |
| HTTP client | Axios (interceptors for JWT refresh) |
| Auth | JWT access tokens (in-memory) + refresh token (HTTP-only cookie), Google OAuth |
| Charts | Recharts |
| Icons | Lucide React |
| Dates | Day.js |
| Payments | Razorpay (guest checkout) |
| Container | Docker (multi-stage build, Node 20 Alpine) |

---

## Project structure

```
concierge-frontend/
├── app/                    # Next.js routes and layouts
│   ├── (auth)/             # Login layout and pages
│   ├── (dashboard)/        # Authenticated dashboard (overview, rooms, services, profile)
│   ├── (onboarding)/       # Property onboarding flow
│   ├── payment/            # Guest payment pages
│   ├── layout.tsx          # Root layout and global providers
│   └── page.tsx            # Landing page
├── components/             # Shared UI (header, sidebar, modal, API client, etc.)
├── context/                # React context providers (auth, UI, rooms, services, payment)
├── features/               # Feature modules (auth, home, rooms, services, overview, …)
├── public/                 # Static assets
├── proxy.ts                # Route middleware (auth redirects — partially implemented)
├── widget-dev.html         # Standalone page for widget development
├── Dockerfile
└── docker-compose.yml
```

Routes are grouped with Next.js route groups. Business logic lives under `features/`; cross-cutting concerns (API client, env config, shared components) live under `components/`.

---

## Prerequisites

- **Node.js** 20+
- **npm** (or yarn / pnpm)
- A running **ConciergeOS backend API** (this frontend expects a REST API at `{NEXT_PUBLIC_API_BASE_URL}/api/v1`)

---

## Environment variables

Create a `.env` file in the project root:

```env
# Required — backend API origin (no trailing slash)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Required for Google sign-in
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id

# Optional — strips console logs in production builds (except errors)
APP_ENV=production
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the backend; the app calls `{value}/api/v1` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID for `@react-oauth/google` |
| `APP_ENV` | Set to `production` to enable console stripping in `next.config.ts` |

---

## Getting started

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Docker

The app uses Next.js **standalone** output for lean production images.

### Build and run with Docker Compose

Ensure `.env` is present with the required variables, then:

```bash
docker compose up --build
```

The container exposes port **3000**. Build args `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` are passed at image build time (see `docker-compose.yml` and `Dockerfile`).

### Manual Docker build

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id \
  -t concierge-frontend .
```

---

## Authentication flow

1. On load, `BaseContextProvider` attempts to refresh the access token using the HTTP-only `refreshToken` cookie (`POST /api/v1/auth/refresh-accesstoken`).
2. The access token is stored in memory via `components/lib/token-store.ts` and attached to API requests as a `Bearer` header.
3. On `401` responses, Axios retries once after refreshing the token; if refresh fails, the user is redirected to `/login`.
4. Sign-up triggers OTP verification before the account is fully activated.
5. Google OAuth is available when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is configured.

Route protection logic exists in `proxy.ts` (intended as Next.js middleware) but redirect rules are currently commented out.

---

## Key routes

| Path | Purpose |
|------|---------|
| `/` | Marketing landing page |
| `/login` | Sign in / sign up |
| `/onboarding` | New property setup |
| `/overview` | Dashboard home |
| `/rooms` | Room and booking management |
| `/rooms/[id]` | Individual room detail |
| `/rooms/type/[id]` | Room type detail |
| `/services` | Services and staff |
| `/services/[id]` | Service detail and sub-services |
| `/profile` | Property profile and widget embed code |
| `/payment/[id]` | Guest payment (JWT in URL) |
| `/payment/success` | Post-payment confirmation |

---

## API integration

All authenticated requests go through `components/api/service-provider.ts`, which:

- Sets `baseURL` to `{NEXT_PUBLIC_API_BASE_URL}/api/v1`
- Sends credentials (`withCredentials: true`) for cookie-based refresh
- Injects the access token and handles automatic token refresh

Representative endpoints used by the app:

- `POST /auth/refresh-accesstoken` — refresh session
- `GET /auth/userDetails` — current user
- `POST /property/register-property` — onboarding
- `GET /overview`, `/room/*`, `/room-bookings`, `/services`, `/staff`, `/bookings` — dashboard data

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build (standalone) |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## Development notes

- **Path alias**: `@/*` maps to the project root (see `tsconfig.json`).
- **Styling**: Tailwind CSS v4 with the DaisyUI plugin; custom fonts include Plus Jakarta Sans and Playfair Display.
- **React Query Devtools** are wired in via `QueryContextProvider` for local debugging.
- **Widget dev**: Open `widget-dev.html` in a browser (or serve it statically) to test the booking widget in isolation.

---

## License

Private — not published to npm (`"private": true` in `package.json`).
