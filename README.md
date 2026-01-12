# next15-auth-app
Authentication system built with Next.js 15 and NextAuth v5. Supports Credentials &amp; OAuth auth, email verification, 2FA, protected routes, server/client user pages and adaptive account settings based on auth provider.

# 🔐 Advanced Authentication System (Next.js 15)

Production-ready authentication and authorization system built with **Next.js 15 (App Router)** and **NextAuth v5**.

The project demonstrates real-world authentication flows, security practices, and architectural decisions used in modern web applications.

This repository focuses on **correct auth design**, **secure session handling**, and **clear separation of server and client responsibilities**.

---

## 🎯 Project Goals

- Implement a **realistic authentication system**, not a demo
- Cover **Credentials + OAuth** authentication
- Demonstrate **security-first decisions**
- Show **SSR vs CSR usage with authenticated data**
- Build a scalable base for production applications

---

## 🧱 Tech Stack

- **Next.js 15 (App Router)**
- **NextAuth v5**
- **TypeScript**
- **React**
- **TailwindCSS**
- **OAuth 2.0 (Google, GitHub)**
- **JWT / Session-based authentication**
- **Prisma & PostgreSQL / Database

---

## 🔑 Authentication Features

### Credentials Authentication
- User registration (email + password)
- Secure login
- Email verification before full access
- Password change flow
- Optional two-factor authentication (2FA)

### OAuth Authentication
- Google OAuth
- GitHub OAuth
- Account creation on first OAuth login
- Limited settings based on provider capabilities

### Session Management
- Server-side session validation
- Client-side session consumption
- Secure access to protected routes
- Centralized auth configuration

---

## 🔐 Security Design Decisions

This project intentionally focuses on **practical security**, not just feature completeness.

### Email Verification
- User cannot fully access protected areas without verified email
- Prevents fake or disposable account abuse

### Two-Factor Authentication (2FA)
- Optional per-user
- Applied only for Credentials-based accounts
- Enforced during login
- Separate logic from OAuth flow

### OAuth vs Credentials Separation
- OAuth users:
  - Cannot change password
  - Have limited account settings
- Credentials users:
  - Full control over email, password, 2FA

This prevents invalid security states (e.g. OAuth user with password).

### Protected Routes
- Middleware-based route protection
- Server-side checks for sensitive pages
- No reliance on client-only guards

---

## 🧭 Routing & Access Control

| Route | Access | Description |
|------|-------|------------|
| `/auth/login` | Public | Login page |
| `/auth/register` | Public | Registration |
| `/auth/email-verification` | Public | Email verification |
| `/settings` | Protected | Account settings |
| `/server-profile` | Protected | Server-side user page |
| `/client-profile` | Protected | Client-side user page |

All protected routes require a valid session and pass server-side validation.

---

## 🧠 Server vs Client Rendering Strategy

### Server-side User Page
- Fetches session and user data on the server
- Ideal for:
  - SEO
  - Secure data access
  - Initial render without loading states

### Client-side User Page
- Uses client session hooks
- Demonstrates:
  - Reactive UI
  - Session state updates
  - Client-only logic

This separation reflects **real production trade-offs**, not artificial examples.

---

## ⚙️ Account Settings Logic

The settings page dynamically adapts to the authentication method.

### Credentials User
- Change name
- Change email
- Change password
- Enable / disable 2FA

### OAuth User
- Change name
- View connected provider
- No password or 2FA options

This avoids invalid configuration paths and improves security.

---

## 🧩 Architecture Overview

Key architectural principles used:

- Clear separation of concerns
- Minimal client-side trust
- Server-first validation
- Scalable auth configuration

### Key Concepts
- Centralized auth config
- Reusable auth utilities
- Explicit server/client boundaries
- Middleware-driven access control

The project is structured to be easily extended with:
- Roles & permissions
- Admin dashboards
- Audit logs
- Additional OAuth providers

---

## 🧪 Testing Strategy (Design-Level)

Although automated tests are not included yet, the project is structured with testing in mind.

### Intended Test Coverage
- Auth flow integration tests
- Session validation tests
- Middleware access tests
- Settings permission tests
- 2FA enforcement scenarios

### Testing Types
- Unit tests for auth utilities
- Integration tests for auth routes
- E2E tests for login / registration flows

---

## 📦 Environment Setup

### Installation
```bash
git clone https://github.com/DeemouMeow/next15-auth-app.git
cd next15-auth-app
npm install
```

## 📦 Local Variables

```bash
DATABASE_URL=url
NEXT_PUBLIC_APP_URL = "http://localhost:3000"

AUTH_SECRET=auth_secret

AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret

AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

RESEND_API_KEY=your_resend_api_key
```

## How to run?
```bash
npm run dev
```
