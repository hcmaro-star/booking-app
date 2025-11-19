import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const KEY = "reservations";

function toJsonString(raw: any): string {
  if (!raw || raw === "") return "[]";  // ← 여기 "" 추가!!! 이게 핵심
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object" && typeof raw.result === "string") return raw.result;
  if (raw && typeof raw === "object" && typeof raw.data === "string") return raw.data;
  if (Array.isArray(raw)) return JSON.stringify(raw);  // ← 만약 이미 배열로 오면 stringify
  return "[]";
}

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
    const json = toJsonString(raw);
    const list = JSON.parse(json);

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
      { ok: false, error: "Failed to confirm", detail: e.message },
      { status: 500 }
    );
  }
}
