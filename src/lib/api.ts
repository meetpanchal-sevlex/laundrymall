const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://api.laundrymall.in").replace(/\/$/, "");

interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

export async function medusaFetch(path: string, options: FetchOptions = {}, token?: string) {
  const url = path.startsWith("http") ? path : `${MEDUSA_URL}${path}`;
  const retries = options.retries ?? 2;
  const retryDelay = options.retryDelay ?? 1000;
  
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let lastError: any;

  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers,
      });

      // If it's a transient server error (502, 503, 504), retry
      if (res.status >= 500 && res.status < 600) {
        throw new Error(`Server error: ${res.status}`);
      }

      // If unauthorized, we might want to trigger a logout, but for now just return
      return res;
    } catch (error) {
      lastError = error;
      // Only retry on network errors (like timeouts or ECONNRESET) or 500s
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * (i + 1)));
      }
    }
  }

  throw lastError;
}
