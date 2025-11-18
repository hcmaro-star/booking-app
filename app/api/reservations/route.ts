import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const KEY = "reservations";
export const revalidate = 0;

// Upstash 반환 변수를 안전하게 문자열로 변환
function toJsonString(raw: any): string {
  if (!raw) return "[]";

  // 문자열이면 그대로
  if (typeof raw === "string") return raw;

  // Upstash: { result: "..." }
  if (typeof raw === "object" && typeof raw.result === "string") {
    return raw.result;
  }

  // Upstash 최신 형태: { data: "..." }
  if (typeof raw === "object" && typeof raw.data === "string") {
    return raw.data;
  }

  // 예측 못한 형태면 빈 배열
  return "[]";
}

// GET
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

// POST
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
