import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const KEY = "reservations";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const raw = await redis.get(KEY);
    const list = raw ? JSON.parse(raw as string) : [];

    const index = list.findIndex((r: any) => r.id === id);
    if (index === -1) {
      return NextResponse.json(
        { ok: false, error: "Reservation not found" },
        { status: 404 }
      );
    }

    list[index].status = "confirmed";
    list[index].confirmedAt = new Date().toISOString();

    await redis.set(KEY, JSON.stringify(list));

    return NextResponse.json({ ok: true, reservation: list[index] });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Confirm failed", detail: e.message },
      { status: 500 }
    );
  }
}
