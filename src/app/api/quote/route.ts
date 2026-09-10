import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

// Initialize Redis if credentials exist
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

// File fallback path
const LEADS_FILE = path.join(process.cwd(), "src", "data", "quote_leads.json");

function saveLocalLead(lead: any) {
  try {
    let leads: any[] = [];
    if (fs.existsSync(LEADS_FILE)) {
      const content = fs.readFileSync(LEADS_FILE, "utf-8");
      leads = JSON.parse(content || "[]");
    }
    leads.unshift(lead);
    // Keep last 200 leads locally
    if (leads.length > 200) leads = leads.slice(0, 200);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write local lead backup:", err);
  }
}

function getLocalLeads(): any[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const content = fs.readFileSync(LEADS_FILE, "utf-8");
      return JSON.parse(content || "[]");
    }
  } catch (err) {
    console.error("Failed to read local leads:", err);
  }
  return [];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, businessName, notes, source } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and Phone number are required." },
        { status: 400 }
      );
    }

    const lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: String(name).trim(),
      phone: String(phone).trim(),
      businessName: businessName ? String(businessName).trim() : "Not specified",
      notes: notes ? String(notes).trim() : "General Wholesale / Turnkey Inquiry",
      source: source || "quote_modal",
      createdAt: new Date().toISOString(),
    };

    console.log("====================================");
    console.log("🔥 [NEW COMMERCIAL QUOTE LEAD RECEIVED]:", lead);
    console.log("====================================");

    // 1. Save to Redis
    if (redis) {
      try {
        await redis.lpush("laundrymall:quote_leads", JSON.stringify(lead));
      } catch (redisErr) {
        console.error("Failed to push lead to Redis:", redisErr);
      }
    }

    // 2. Save to local JSON backup
    saveLocalLead(lead);

    return NextResponse.json({
      success: true,
      message: "Lead saved successfully.",
      leadId: lead.id,
    });
  } catch (error: any) {
    console.error("Error in /api/quote POST:", error);
    return NextResponse.json(
      { error: "Failed to process quote request." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    let leads: any[] = [];

    // 1. Try Redis
    if (redis) {
      try {
        const rawLeads = await redis.lrange("laundrymall:quote_leads", 0, 99);
        leads = rawLeads.map((item: any) =>
          typeof item === "string" ? JSON.parse(item) : item
        );
      } catch (err) {
        console.error("Failed to read from Redis:", err);
      }
    }

    // 2. Fallback to local file if Redis is empty or offline
    if (leads.length === 0) {
      leads = getLocalLeads();
    }

    return NextResponse.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error: any) {
    console.error("Error in /api/quote GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads." },
      { status: 500 }
    );
  }
}
