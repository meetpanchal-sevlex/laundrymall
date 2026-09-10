import { NextRequest, NextResponse } from "next/server";
import { getCachedFrontendProducts } from "@/lib/medusa-cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  const allProducts = await getCachedFrontendProducts();

  // Fast substring match across name, category, and description
  const filtered = allProducts.filter((p) => {
    const name = (p.name || "").toLowerCase();
    const category = (p.category || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    return name.includes(q) || category.includes(q) || desc.includes(q);
  }).slice(0, 8);

  return NextResponse.json(
    { products: filtered },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
