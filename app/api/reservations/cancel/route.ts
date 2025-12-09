// app/api/reservations/cancel/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const KEY = "reservations";

export const dynamic = "force-dynamic"; // 캐시 절대 안 쓰게 강제

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    const raw = await redis.get(KEY);
    const list = raw ? JSON.parse(raw as string) : [];

    const updated = list.map((item: any) =>
      item.id === id ? { ...item, status: "cancelled" } : item
    );

    await redis.set(KEY, JSON.stringify(updated));

    return NextResponse.json(
      { ok: true },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (e) {
    return NextResponse.json({ ok: false, error: "cancel failed" }, { status: 500 });
  }
}

// 아이폰 Safari CORS 문제 해결용
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}