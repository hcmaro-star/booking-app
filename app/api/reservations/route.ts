import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export const revalidate = 0
const KEY = "reservations"

// GET
export async function GET() {
  try {
    const raw = await redis.get(KEY)
    const list = typeof raw === "string" ? JSON.parse(raw) : []
    return NextResponse.json(list)
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to get reservations", detail: e.message },
      { status: 500 }
    )
  }
}

// POST
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, guests, start, end } = body

    if (!name || !phone || !start || !end) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const raw = await redis.get(KEY)
    const list = typeof raw === "string" ? JSON.parse(raw) : []

    list.push({ name, phone, guests, start, end })

    await redis.set(KEY, JSON.stringify(list))

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to save", detail: e.message },
      { status: 500 }
    )
  }
}
