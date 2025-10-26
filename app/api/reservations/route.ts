export const runtime = "nodejs"; // ioredis는 Edge 런타임에서 동작하지 않음
import { NextResponse } from "next/server";
import redis from "@/lib/redis";

const KEY = "reservations";

// 전화번호 마스킹 (예: 01012345678 -> 010****5678)
function maskPhone(phone: string) {
  const only = String(phone ?? "").replace(/\D/g, "");
  return only.replace(/(\d{3})\d{4}(\d+)/, "$1****$2");
}

// 예약 목록 조회
export async function GET() {
  try {
    const items = await redis.lrange(KEY, 0, -1); // 최신이 앞쪽
    const list = items
      .map((s) => {
        try { return JSON.parse(s); } catch { return null;}
      })
      .filter(Boolean)
      .map((r: any) => ({
        ...r,
        phone: maskPhone(r.phone),
      }));

    return NextResponse.json(list);
  } catch (err) {
    console.error("GET /api/reservations error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

// 예약 생성
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, guests, start, end } = body || {};

    if (!name || !phone || !start || !end) {
      return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
    }

const id = Math.random().toString(36).slice(2, 10);

const doc = {
  id,
  name,
  phone,
  guests: Number(guests || 1),
  start,
  end,
  createdAt: new Date().toISOString(),
};

await redis.lpush(KEY, JSON.stringify(doc)); 

    // 프론트는 성공만 확인하면 되므로 간단히 응답
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("POST /api/reservations error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

