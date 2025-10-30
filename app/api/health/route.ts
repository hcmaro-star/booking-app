// src/app/api/health/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const pong = await redis.ping();
    return NextResponse.json({ ok: true, pong });
  } catch (e: any) {
    console.error("[HEALTH]", e?.message, e?.code);
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}