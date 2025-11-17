import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/src/lib/redis";

const KEY = "reservations";

// GET
export const dynamic = "force-dynamic";   // 🔥 SSR 강제, 캐시 무효화
export const revalidate = 0;              // 🔥 캐시 재검증 안함

import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/src/lib/redis";

const KEY = "reservations";

export async function GET() {
  try {
    const raw = await redis.get(KEY);

    if (!raw) return NextResponse.json([]);

    let list = [];

    try {
      list = JSON.parse(raw);
      if (!Array.isArray(list)) list = [];
    } catch {
      list = [];
    }

    return NextResponse.json(list, {
      headers: {
        "Cache-Control": "no-store",  // 🔥 캐시 절대 사용 금지
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "failed", detail: e.message },
      { status: 500 }
    );
  }
}

// POST
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, guests, start, end } = body || {};

    if (!name || !phone || !start || !end) {
      return NextResponse.json(
        { error: "bad_request" },
        { status: 400 }
      );
    }

    const raw = await redis.get(KEY);
    let list = [];

    try {
      list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) list = [];
    } catch {
      list = [];
    }

    const doc = {
      id: Date.now(),
      name,
      phone,
      guests: Number(guests) || 1,
      start,
      end,
      createdAt: new Date().toISOString(),
    };

    list.push(doc);

    await redis.set(KEY, JSON.stringify(list));

    return NextResponse.json({ ok: true, id: doc.id });
  } catch (e: any) {
    return NextResponse.json(
      { error: "failed", detail: e.message },
      { status: 500 }
    );
  }
}
