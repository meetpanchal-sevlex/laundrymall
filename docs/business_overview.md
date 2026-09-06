# LaundryMall - Platform Overview (For Business Owners)

This document explains the custom engineering behind LaundryMall. Instead of using a basic website builder (like Wix or standard Shopify), this platform was custom-built using the same technology that powers massive tech companies. Here is a breakdown of what we built and why it matters to your business.

## How Everything is Connected (The Big Picture)
Here is a simple map of how the different pieces of your new platform work together to protect your business and serve your customers:

```mermaid
graph TB
    subgraph USERS["👥 Users"]
        Customer((Customer))
        Owner((Store Owner))
    end

    subgraph EDGE["🛡️ Edge Layer — Vercel Global Network"]
        Firewall{Upstash Redis\nRate Limiter}
        RouteGuard{Next.js\nEdge Middleware}
        Cache[/"Next.js ISR Cache\n60s Products · 1hr Catalog"/]
    end

    subgraph FRONTEND["🏬 Frontend — Next.js 16 + React 19"]
        Homepage[Home Page]
        Catalog[Product Catalog]
        ProductPage[Product Detail]
        CartUI[Cart Drawer]
        CheckoutUI[Checkout Flow]
        AccountUI[My Account]
        OrderTracker[Order Tracker\nProcessing → Shipped → Delivered]
    end

    subgraph BACKEND["🧠 Commerce Engine — Medusa.js v2"]
        AuthAPI[Auth API\nJWT + HttpOnly Cookies]
        CartAPI[Cart Engine\nGuest → Customer Linking]
        OrderAPI[Order Manager]
        PaymentAPI[Payment Orchestrator]
        ProductAPI[Product & Inventory]
    end

    subgraph INFRA["🗄️ Infrastructure"]
        DB[(PostgreSQL\nDatabase)]
        Razorpay[💳 Razorpay\nPayment Gateway]
        Sentry[🔍 Sentry\nError Monitoring]
    end

    %% User Flows
    Customer -->|Visits Site| Firewall
    Firewall -->|Bots Blocked| BLOCKED([🚫 Blocked])
    Firewall -->|Real Traffic| RouteGuard

    RouteGuard -->|Not Logged In → /account| AuthAPI
    RouteGuard -->|Logged In| FRONTEND

    %% Frontend ↔ Cache
    Cache -.->|Serves Instantly| Homepage
    Cache -.->|Serves Instantly| Catalog
    Cache -.->|Serves Instantly| ProductPage

    %% Frontend → Backend
    CartUI -->|Add / Remove Items| CartAPI
    CheckoutUI -->|Submit Order| PaymentAPI
    AccountUI -->|Login / Signup| AuthAPI
    OrderTracker -->|Polls Status| OrderAPI

    %% Backend → Infra
    CartAPI -->|Persists Cart| DB
    AuthAPI -->|Customer Records| DB
    OrderAPI -->|Order Records| DB
    ProductAPI -->|Catalog Data| DB
    PaymentAPI -->|Initiates Payment| Razorpay
    Razorpay -->|Confirms Payment| OrderAPI

    %% Owner Flow
    Owner -->|Manages Inventory| ProductAPI
    Owner -->|Fulfills Orders| OrderAPI
    OrderAPI -->|Triggers UI Update| OrderTracker

    %% Monitoring
    FRONTEND -.->|Logs Errors| Sentry
    BACKEND -.->|Logs Errors| Sentry
```

## 1. The "Two-Brain" System (Headless Architecture)
Normally, a website's design and its database are mixed together. If the database gets slow, the whole website crashes. 
* **What we did:** We split LaundryMall into two separate "brains." The front end (what the customer clicks) runs independently from the back end (where your orders and data live).
* **Business Value:** Your store will load lightning fast for customers, and even if your admin dashboard is processing thousands of orders, the storefront will never slow down or crash.

## 2. The Smart Memory (Caching System)
If 1,000 customers visit your site at the exact same time, a normal website will ask the database for the price of a product 1,000 times, causing the server to crash.
* **What we did:** We built a "Smart Memory" system. The website takes a snapshot of your catalog and memorizes it. It only checks the database for updates every 60 seconds.
* **Business Value:** Zero server crashes during big sales or traffic spikes. It also keeps your server hosting costs incredibly low because the database isn't working overtime.

## 3. The Bouncer (Edge Security & Anti-Hacking)
We don't want bots spamming your website, attempting to guess customer passwords, or trying to bring the site down.
* **What we did:** We built an "Edge Security Shield" that sits *outside* your website. If an IP address tries to guess a password too many times in 10 seconds, this shield instantly blocks them before they even reach your actual server.
* **Business Value:** Enterprise-grade security. Your customers' data is safe, and your server won't get overwhelmed by malicious bot traffic.

## 4. The "Magic" Shopping Cart
A common issue in e-commerce is when a customer adds 5 items to their cart *before* logging in. When they finally log in or create an account, their cart empties out, causing them to abandon the purchase.
* **What we did:** We wrote custom logic that secretly remembers the guest's cart. The moment they log in or sign up, the system automatically merges their anonymous cart into their new customer profile.
* **Business Value:** Higher conversion rates and zero lost sales from frustrated customers.

## 5. The Live Order Tracker
Customers hate wondering where their order is, which leads to them calling or emailing your support line constantly.
* **What we did:** We built a custom dashboard for the customer. When you (the owner) click "Create Fulfillment" or "Mark as Delivered" in your private admin panel, the customer's dashboard instantly updates a visual 3-step progress bar (Processing -> Shipped -> Delivered).
* **Business Value:** Less customer support emails, and a highly professional, Amazon-like experience for the buyer.
