# LaundryMall - Enterprise Technical Stack

This document outlines the headless e-commerce architecture, frameworks, and infrastructure used to build the LaundryMall platform.

## 🏗️ Infrastructure & Hosting Flowchart
This diagram provides a high-level view of where each piece of technology lives in the cloud and how the different providers (Vercel, Railway, Cloudflare, Upstash) connect to form the enterprise stack.

```mermaid
graph TD
    subgraph VERCEL["▲ Vercel Cloud (Frontend & Edge)"]
        Edge["Edge Middleware\n(Bouncer & Security)"]
        NextJS["Next.js 16 App Router\n(React 19, Tailwind v4, Zustand)"]
    end

    subgraph UPSTASH["🟢 Upstash (Serverless Edge)"]
        Redis[("Redis Database\n(Rate Limiting & Memory)")]
    end

    subgraph RAILWAY["🚂 Railway Cloud (Backend & Data)"]
        Medusa["Medusa.js v2\n(Commerce Engine / Node.js)"]
        Postgres[("PostgreSQL\n(Primary Relational DB)")]
    end

    subgraph CLOUDFLARE["☁️ Cloudflare (CDN & Storage)"]
        R2[("R2 Object Storage\n(Product Images & Media)")]
    end

    subgraph EXTERNAL["🔌 External APIs"]
        Razorpay["Razorpay\n(Payment Gateway)"]
        Sentry["Sentry\n(Error Monitoring)"]
    end

    %% Routing Flow
    User((👤 Customer)) -->|Visits Site| Edge
    Edge <-->|Verifies IP Limit| Redis
    Edge -->|Passes Traffic| NextJS

    %% Core App Flow
    NextJS <==>|Fetches Data (REST API)| Medusa
    Medusa <==>|Reads/Writes| Postgres

    %% Media Flow
    Medusa -->|Uploads Product Assets| R2
    NextJS -.->|Serves Fast Images| R2

    %% 3rd Party Flow
    Medusa <-->|Processes Transactions| Razorpay
    NextJS -.->|Logs Errors| Sentry
    Medusa -.->|Logs Errors| Sentry
```

## 1. Core Architecture
**Headless E-Commerce Model:** The platform uses a decoupled architecture where the frontend presentation layer is completely separated from the backend commerce engine, communicating exclusively via secure REST APIs.

## 2. Frontend (Presentation Layer)
* **Framework:** Next.js 16 (App Router)
* **UI Library:** React 19
* **Styling:** Tailwind CSS v4
* **State Management:** Zustand (for lightweight, scalable client-side state)
* **Icons & Assets:** Lucide React
* **Data Fetching:** Next.js Server Actions (BFF - Backend for Frontend pattern)

## 3. Backend (Commerce Engine)
* **Framework:** Medusa.js v2 (Node.js based headless commerce)
* **Database:** PostgreSQL (Relational database for ACID compliance)
* **Core Modules:** Product PIM, Cart Engine, Customer Profiles, Order Management.

## 4. Security & Edge Infrastructure
* **Edge Middleware:** Next.js Edge Middleware for route protection and traffic interception.
* **Rate Limiting:** Upstash Redis (Sliding window algorithm configured to 5 req/1m for auth brute-force protection).
* **Authentication:** Stateless JWT sessions stored in `HttpOnly`, `Secure`, `SameSite=Lax` cookies to prevent XSS and CSRF attacks.
* **Input Sanitization:** Zod schema validation applied to all Server Actions before backend execution.

## 5. Performance & Caching Strategy
* **Caching Engine:** Next.js `unstable_cache` with Incremental Static Regeneration (ISR).
* **Revalidation Rules:**
  * Products: `60 seconds` (Ensures inventory freshness without database strain)
  * Regions/Collections: `3600 seconds` (1 hour)
* **Edge Routing:** Deployed on Vercel's global edge network for sub-50ms latency.

## 6. Integrations & DevOps
* **Payment Gateway:** Razorpay API 
* **Frontend Hosting:** Vercel (Washington, D.C. - iad1)
* **Backend Hosting:** Railway.app (Production environment)
* **Monitoring & Observability:** Sentry (Error tracking), Vercel Speed Insights.
