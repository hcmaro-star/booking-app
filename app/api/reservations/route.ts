import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";


export const revalidate = 0; // 캐시 방지
const KEY = "reservations";

// GET: 예약 목록 조회
export async function GET() {
  try {
    const raw = await redis.get(KEY);
    const list = raw ? JSON.parse(raw as string) : [];
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
    const { name, phone, guests, start, end } = body ?? {};

    if (!name || !phone || !start || !end) {
      return NextResponse.json(
        { error: "bad_request", detail: "missing_fields" },
        { status: 400 }
      );
    }

    const raw = await redis.get(KEY);
    const list = raw ? JSON.parse(raw as string) : [];

    const doc = {
      id: Math.random().toString(36).slice(2),
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
