# E-Commerce Cart Architecture

Here is the precise architectural flowchart showing exactly how data moves from the user's click down to the database, and specifically where the **Medusa SDK** fits in.

```mermaid
sequenceDiagram
    autonumber
    
    actor User as 📱 Browser<br/>(Customer)
    participant RQ as ⚡ React Query<br/>(Optimistic UI)
    participant Next as 🖥️ Next.js Server Actions<br/>(The Waiter)
    participant SDK as 🔌 Medusa SDK<br/>(The Walkie-Talkie)
    participant Medusa as 🏦 Medusa Backend<br/>(The Kitchen)
    participant DB as 🗄️ PostgreSQL<br/>(The Vault)

    User->>RQ: 1. Clicks "+ Add to Cart"
    
    Note over User,RQ: React Query instantly fakes<br/>the UI update (Illusion)
    
    RQ->>Next: 2. Sends background network request
    
    Next->>SDK: 3. Calls `medusaClient.store.cart.createLineItem()`
    
    Note over Next,SDK: The SDK lives strictly here.<br/>It formats the data & attaches API keys.
    
    SDK->>Medusa: 4. Secure API POST request
    
    Medusa->>DB: 5. Validates rules, math, & inventory.<br/>Saves to database.
    
    DB-->>Medusa: 6. Confirm save
    
    Medusa-->>SDK: 7. Returns the fresh, calculated Cart
    
    SDK-->>Next: 8. Parses JSON into strict Typescript objects
    
    Note over Next: Next.js reads `noStore()`<br/>and bypasses the cache.
    
    Next-->>RQ: 9. Returns the final, true cart state
    
    Note over User,RQ: React Query overwrites the fake UI<br/>with the permanent database truth.
```

### Key Takeaways
1. **React Query** only exists on the far left (in the browser) to make things look fast.
2. **The Medusa SDK** only exists in the middle (on the Next.js server) to ensure we talk to the backend perfectly.
3. **Medusa** sits on the far right, holding the absolute truth.
