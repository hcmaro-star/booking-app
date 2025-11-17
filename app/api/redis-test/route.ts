import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    // Test write
    await redis.set("test-key", "hello");

    // Test read
    const value = await redis.get("test-key");

    return NextResponse.json({
      ok: true,
      msg: "Redis connection OK",
      value: value
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err.message || String(err)
    }, { status: 500 });
  }
}
