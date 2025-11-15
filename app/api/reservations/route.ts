// src/app/api/reservations/route.ts
export const runtime = "nodejs"; // ioredis는 Edge에서 동작 X
import { NextResponse, NextRequest } from "next/server";
import { redis } from "@/lib/redis";

const KEY = "reservations";

function logError(tag: string, e: any) {
  console.error(`[${tag}]`, {
    message: e?.message,
    name: e?.name,
    code: e?.code,
    stack: e?.stack,
  });
}

// GET: 목록
export async function GET(req: NextRequest) {
  try {
    const raw = await redis.get(KEY);
    const list = raw ? JSON.parse(raw as string) : [];
    return NextResponse.json(list);
  } catch (e: any) {
    logError("GET_RESERVATIONS", e);
    return NextResponse.json(
      { error: "failed", detail: e?.message },
      { status: 500 }
    );
  }
}

// POST: 생성
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, guests, start, end } = body || {};

    if (!name || !phone || !start || !end) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }

    // 기존 예약 목록 가져오기
    const raw = await redis.get(KEY);
    const list = raw ? JSON.parse(raw as string) : [];

    // 새 예약 생성
    const doc = {
      id: Math.random().toString(36).slice(2, 10),
      name,
      phone,
      guests: Number(guests) || 1,
      start,
      end,
      createdAt: new Date().toISOString(),
    };
    list


    await redis.set(KEY, JSON.stringify(list));
    return NextResponse.json({ ok: true, id: doc.id });
  } catch (e: any) {
    logError("POST_RESERVATION", e);
    return NextResponse.json(
      { error: "failed", detail: e?.message },
      { status: 500 }
    );
  }
}