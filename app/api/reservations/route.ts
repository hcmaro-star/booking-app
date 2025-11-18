import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { v4 as uuid } from "uuid"

export const revalidate = 0
const KEY = "reservations"

// GET: 전체 예약 리스트 반환
export async function GET() {
  try {
    const raw = await redis.get(KEY)
    const list = raw ? JSON.parse(raw as string) : []
    return NextResponse.json(list)
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to get reservations", detail: e.message },
      { status: 500 }
    )
  }
}

// POST: 예약 생성
export async function POST(req: NextRequest) {
  try {
    // --- BODY 확인
    let body: any;
    try {
      body = await req.json();
    } catch (e) {
      console.error("❌ req.json() 파싱 실패:", e);
      return NextResponse.json(
        { ok: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    console.log("📌 받은 body:", body);

    const { name, phone, guests, start, end } = body;

    if (!name || !phone || !start || !end) {
      console.error("❌ 누락된 필드:", body);
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // --- Redis에서 기존값 읽기
    const raw = await redis.get(KEY);
    console.log("📌 Redis raw:", raw);

    const list = typeof raw === "string" ? JSON.parse(raw) : [];
    console.log("📌 기존 list:", list);

    // --- 새로운 예약 추가
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

    // --- Redis 저장
    try {
      await redis.set(KEY, JSON.stringify(list));
    } catch (e) {
      console.error("❌ redis.set() 실패:", e);
      return NextResponse.json(
        { ok: false, error: "Redis save failed", detail: String(e) },
        { status: 500 }
      );
    }

    console.log("✅ 저장 완료:", newItem);

    return NextResponse.json({ ok: true, reservation: newItem });

  } catch (e: any) {
    console.error("❌ POST 전체 오류:", e);

    return NextResponse.json(
      { ok: false, error: "Failed to save", detail: e.message },
      { status: 500 }
    );
  }
}
