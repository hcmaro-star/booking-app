import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const revalidate = 0;
const KEY = "reservations";

/** Upstash의 반환(raw)이
 *  - string
 *  - null
 *  - { result: "string" }
 *  - { data: "string" }
 *  어떤 형태이든 문자열을 반환하도록 통일
 */
function toJsonString(raw: any): string {
  if (!raw || raw === "") return "[]";  // ← 여기 "" 추가!!! 이게 핵심
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object" && typeof raw.result === "string") return raw.result;
  if (raw && typeof raw === "object" && typeof raw.data === "string") return raw.data;
  if (Array.isArray(raw)) return JSON.stringify(raw);  // ← 만약 이미 배열로 오면 stringify
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
