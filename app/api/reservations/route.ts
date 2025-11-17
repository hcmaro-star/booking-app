import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const KEY = "reservations";

export const revalidate = 0;

// GET: 예약 목록 조회
export async function GET() {
  try {
    const raw = await redis.get(KEY);
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
    const { name, phone, guests, start, end } = body ?? {};

    if (!name || !phone || !start || !end) {
      return NextResponse.json(
        { error: "bad_request", detail: "missing_fields" },
        { status: 400 }
      );
    }

    const raw = await redis.get(KEY);
    const list = raw ? JSON.parse(raw) : [];

    list.push({ name, phone, guests, start, end });

    await redis.set(KEY, JSON.stringify(list));

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: "failed", detail: e.message },
      { status: 500 }
    );
  }
}
