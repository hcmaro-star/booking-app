// app/api/reservations/modify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const revalidate = 0;
const KEY = "reservations";

export async function POST(req: NextRequest) {
  try {
    const { id, start, end } = await req.json();

    if (!id || !start || !end) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const raw = await redis.get(KEY);
    const list = typeof raw === "string" ? JSON.parse(raw) : [];

    const index = list.findIndex((r: any) => r.id === id);

    if (index === -1) {
      return NextResponse.json(
        { ok: false, error: "Reservation not found" },
        { status: 404 }
      );
    }

    const target = list[index];
    const oldStart = target.start;
    const oldEnd = target.end;

    // 날짜 변경
    target.start = start;
    target.end = end;
    target.updatedAt = Date.now();

    // 히스토리 기록
    target.history = target.history || [];
    target.history.push({
      type: "modify",
      oldStart,
      oldEnd,
      newStart: start,
      newEnd: end,
      date: Date.now()
    });

    list[index] = target;

    await redis.set(KEY, JSON.stringify(list));

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Modify failed", detail: e.message },
      { status: 500 }
    );
  }
}
