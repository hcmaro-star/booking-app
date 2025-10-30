// src/app/api/reservations/route.ts

export const runtime = "nodejs";  // 반드시 추가!

import { NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL as string);

const KEY = "reservations";

// GET: 예약 목록 조회
export async function GET() {
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
  } catch (err) {
    console.error("GET /api/reservations error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

// POST: 새 예약 저장
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, guests, start, end } = body;

    if (!name || !phone || !start || !end) {
      return NextResponse.json(
        { error: "필수 항목 누락" },
        { status: 400 }
      );
    }

    const createdAt = new Date().toISOString();
    const id = Math.random().toString(36).slice(2, 10);

    const doc = { id, name, phone, guests, start, end, createdAt };

    await redis.rpush(KEY, JSON.stringify(doc));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/reservations error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
