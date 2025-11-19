import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const KEY = "reservations";
export const revalidate = 0;

// Upstash SDK 반환값 → 안정적으로 문자열만 뽑는 함수
function toJsonString(raw: any): string {
  if (!raw) return "[]";

  if (typeof raw === "string") return raw;

  if (typeof raw === "object" && typeof raw.result === "string") {
    return raw.result;
  }

  if (typeof raw === "object" && typeof raw.data === "string") {
    return raw.data;
  }

  return "[]";
}

// GET: 전체 예약 조회
export async function GET() {
  try {
    const raw = await redis.get(KEY);
    const json = toJsonString(raw);
    const list = JSON.parse(json);
    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to load", detail: e.message },
      { status: 500 }
    );
  }
}

// POST: 예약 저장
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
    const json = toJsonString(raw);
    const list = JSON.parse(json);

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
