// src/app/api/reservations/route.ts
export const runtime = "nodejs"; // ioredis는 Edge에서 동작 X
import { NextResponse, NextRequest } from "next/server";
import { redis } from "@/lib/redis";

const KEY = "reservations";

function logError(tag: string, e: any) {
  console.error(`[${tag}]`, {
    message: e?.message,
    name: e?.name,
    code: e?.code,
    stack: e?.stack,
  });
}

// GET: 목록
export async function GET(req: NextRequest) {
  const debug = req.nextUrl.searchParams.get("debug") === "1";
  try {
    const items = await redis.lrange(KEY, 0, -1);
    const list = items
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return NextResponse.json(list);
  } catch (e: any) {
    logError("GET_RESERVATIONS", e);
    return NextResponse.json(
      { error: "failed", detail: debug ? e?.message : undefined },
      { status: 500 }
    );
  }
}

// POST: 생성
export async function POST(req: NextRequest) {
  const debug = req.nextUrl.searchParams.get("debug") === "1";
  try {
    const body = await req.json();
    const { name, phone, guests, start, end } = body || {};
    if (!name || !phone || !start || !end) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }

    const doc = {
      id: Math.random().toString(36).slice(2, 10),
      name,
      phone,
      guests: Number(guests) || 1,
      start,
      end,
      createdAt: new Date().toISOString(),
    };

    await redis.rpush(KEY, JSON.stringify(doc));
    return NextResponse.json({ ok: true, id: doc.id });
  } catch (e: any) {
    logError("POST_RESERVATION", e);
    return NextResponse.json(
      { error: "failed", detail: debug ? e?.message : undefined },
      { status: 500 }
    );
  }
}