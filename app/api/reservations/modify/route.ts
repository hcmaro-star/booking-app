import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const KEY = "reservations";

export async function POST(req: NextRequest) {
  try {
    const { id, start, end } = await req.json();

    if (!id || !start || !end) {
      return NextResponse.json(
        { ok: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const raw = await redis.get(KEY);
    const json = typeof raw === "string" ? raw : "[]";
    const list = JSON.parse(json);

    const updated = list.map((item: any) =>
      item.id === id ? { ...item, start, end, status: "modified" } : item
    );

    await redis.set(KEY, JSON.stringify(updated));

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to modify", detail: e.message },
      { status: 500 }
    );
  }
}
