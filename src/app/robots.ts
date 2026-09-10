import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account",
          "/account/*",
          "/checkout",
          "/checkout/*",
          "/api/*",
        ],
      },
    ],
    sitemap: "https://laundrymall.in/sitemap.xml",
  };
}
