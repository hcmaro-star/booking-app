import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/src/lib/redis";

const KEY = "reservations";

// GET: 모든 예약 조회
export async function GET() {
  try {
    const raw = (await redis.get(KEY)) as string | null;
    const list = raw ? JSON.parse(raw) : [];
    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json(
      { error: "failed", detail: e.message },
      { status: 500 }
    );
  }
}

// POST: 예약 추가
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

    const raw = (await redis.get(KEY)) as string | null;
    const list = raw ? JSON.parse(raw) : [];

    const doc = {
      id: Math.random().toString(36).slice(2, 10),
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
