import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const KEY = "reservations";

export const revalidate = 0;

// GET: 모든 예약 조회
export async function GET() {
  try {
    const raw = await redis.get(KEY);

    let json: string;

    if (!raw) {
      json = "[]";
    } else if (typeof raw === "string") {
      json = raw;
    } else if (typeof raw === "object" && "result" in raw) {
      json = (raw as any).result ?? "[]";
    } else {
      json = "[]";
    }

    const list = JSON.parse(json);
    return NextResponse.json(list);

  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to load list", detail: e.message },
      { status: 500 }
    );
  }
}

// POST: 예약 생성
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, guests, start, end } = body;

    if (!name || !phone || !start || !end) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const raw = await redis.get(KEY);

    let json: string;
    if (!raw) {
      json = "[]";
    } else if (typeof raw === "string") {
      json = raw;
    } else if (typeof raw === "object" && "result" in raw) {
      json = (raw as any).result ?? "[]";
    } else {
      json = "[]";
    }

    const list = JSON.parse(json);

    const newReservation = {
      id: Date.now().toString(),
      name,
      phone,
      guests,
      start,
      end,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    list.push(newReservation);
    await redis.set(KEY, JSON.stringify(list));

    return NextResponse.json({ ok: true, reservation: newReservation });

  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to save", detail: e.message },
      { status: 500 }
    );
  }
}
