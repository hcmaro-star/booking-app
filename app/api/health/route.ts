import { NextResponse } from "next/server";
import { redis } from "../../../src/lib/redis";


export async function GET() {
  try {
    // Redis 테스트 요청
    await redis.ping();
    return NextResponse.json({ ok: true, pong: "PONG" });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message },
      { status: 500 }
    );
  }
}
