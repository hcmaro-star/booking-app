import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Vercel 환경변수에 자동 추가된 Redis URL과 TOKEN 사용
const redis = new Redis({
  url: process.env.KV_REDIS_URL!,
  token: process.env.KV_REDIS_TOKEN!,
});

// ✅ GET: 예약 리스트 불러오기
export async function GET() {
  try {
    const data = (await redis.lrange("reservations", 0, -1)) || [];
    const reservations = data.map((item) => JSON.parse(item));
    return NextResponse.json(reservations);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "데이터를 불러오지 못했습니다." }, { status: 500 });
  }
}

// ✅ POST: 새 예약 저장
export async function POST(req: Request) {
  try {
    const body = await req.json();
    body.id = Date.now().toString();
    body.createdAt = new Date().toISOString();

    await redis.lpush("reservations", JSON.stringify(body));

    return NextResponse.json({ success: true, message: "예약이 저장되었습니다." });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "예약 저장 중 오류 발생" }, { status: 500 });
  }
}

