// app/api/reservations/cancel/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const revalidate = 0;
const KEY = "reservations";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Missing reservation ID" },
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

    // 상태 변경
    target.status = "cancelled";
    target.updatedAt = Date.now();

    // 히스토리 기록
    target.history = target.history || [];
    target.history.push({
      type: "cancel",
      date: Date.now(),
    });

    list[index] = target;

    await redis.set(KEY, JSON.stringify(list));

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Cancel failed", detail: e.message },
      { status: 500 }
    );
  }
}
