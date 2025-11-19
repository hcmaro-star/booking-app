import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const revalidate = 0;
const KEY = "reservations";

// GET: 전체 예약 조회
export async function GET() {
  try {
    const raw = await redis.get(KEY);

    // Upstash Redis SDK는 string 또는 null만 반환함
    const text = typeof raw === "string" ? raw : "[]";

    const list = JSON.parse(text);
    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to load", detail: e.message },
      { status: 500 }
    );
  }
}

// POST: 예약 생성
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, guests, start, end } = body;

    if (!name || !phone || !start || !end) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const raw = await redis.get(KEY);
    const text = typeof raw === "string" ? raw : "[]";
    const list = JSON.parse(text);

    const newItem = {
      id: Date.now().toString(),
      name,
      phone,
      guests,
      start,
      end,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    list.push(newItem);

    await redis.set(KEY, JSON.stringify(list));

    return NextResponse.json({ ok: true, reservation: newItem });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to save", detail: e.message },
      { status: 500 }
    );
  }
}
