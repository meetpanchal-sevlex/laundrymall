# LaundryMall - System Logic & Flowcharts

Below are the architectural flowcharts detailing the complex logic implemented in the LaundryMall platform.

## 1. Edge Security & Authentication Flow
This flowchart demonstrates how the Edge Middleware protects the application from bots and unauthenticated users before they even reach the server.

```mermaid
sequenceDiagram
    participant User
    participant Edge as Next.js Edge Middleware
    participant Redis as Upstash Redis (Rate Limiter)
    participant Next as Next.js Server
    participant Medusa as Medusa Backend

    User->>Edge: POST /login
    Edge->>Redis: Check IP limits (Max 5/min)
    alt Rate Limit Exceeded
        Redis-->>Edge: Block Request
        Edge-->>User: 429 Too Many Requests
    else Allowed
        Edge->>Next: Forward Request
        Next->>Medusa: Authenticate Customer
        Medusa-->>Next: Return JWT
        Next-->>User: Set HttpOnly Cookie & Redirect
    end

    User->>Edge: GET /account
    Edge->>Edge: Check for JWT Cookie
    alt No Cookie
        Edge-->>User: 307 Redirect to /login
    else Has Cookie
        Edge->>Next: Render Account Page
    end
```

## 2. Cart Auto-Healing & Customer Linking
This illustrates the complex logic used to track guest carts and safely merge them into customer profiles without crashing the Medusa validation engine.

```mermaid
flowchart TD
    A[User adds item to Cart] --> B{Is User Logged In?}
    B -- Yes --> C[Add to Customer Cart]
    B -- No --> D[Create Guest Cart]
    D --> E[Save Cart ID in Browser Cookie]
    
    E --> F[User navigates to Login]
    F --> G[Next.js Auth Action fires]
    G --> H{Does Cart Cookie Exist?}
    
    H -- Yes --> I[Fetch Customer ID from Medusa]
    I --> J[medusaClient.store.cart.update]
    J --> K[Cart successfully linked to Profile!]
    
    H -- No --> L[Login Successful]
```

## 3. Order Status Tracking Logic
This diagram explains how the frontend parses Medusa v2's complex fulfillment arrays to generate a clean, user-friendly 3-step progress bar.

```mermaid
stateDiagram-v2
    [*] --> ProcessingOrder: Order Placed
    
    ProcessingOrder --> Shipped: Admin clicks 'Create Fulfillment'
    note right of Shipped: Frontend detects order.fulfillments.length > 0
    
    Shipped --> Delivered: Admin clicks 'Mark as Delivered'
    note right of Delivered: Frontend detects f.delivered_at exists
    
    Delivered --> [*]
    
    ProcessingOrder --> Canceled: Admin cancels order
    Canceled --> [*]
```

## 4. High-Performance Caching Strategy
How we prevent the database from crashing during high-traffic spikes using Incremental Static Regeneration (ISR).

```mermaid
sequenceDiagram
    participant Client
    participant NextCache as Next.js unstable_cache
    participant MedusaDB as Medusa PostgreSQL
    
    Client->>NextCache: Request /products
    alt Cache Hit (Data < 60s old)
        NextCache-->>Client: Instant Response (0 DB Queries)
    else Cache Miss (Data > 60s old)
        NextCache->>MedusaDB: Fetch Live Products
        MedusaDB-->>NextCache: Return Products
        NextCache-->>Client: Serve Response
        note right of NextCache: Cache is updated in background for next users
    end
```
