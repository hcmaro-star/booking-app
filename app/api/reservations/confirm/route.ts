import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

const KEY = "reservations"

export async function POST(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Missing reservation ID" },
        { status: 400 }
      )
    }

    const raw = await redis.get(KEY)
    const list = raw ? JSON.parse(raw as string) : []

    const index = list.findIndex((item: any) => item.id === id)
    if (index === -1) {
      return NextResponse.json(
        { ok: false, error: "Reservation not found" },
        { status: 404 }
      )
    }

    list[index].status = "confirmed"

    await redis.set(KEY, JSON.stringify(list))

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to confirm", detail: e.message },
      { status: 500 }
    )
  }
}
