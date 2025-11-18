import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { v4 as uuid } from "uuid"

export const revalidate = 0
const KEY = "reservations"

// GET: 전체 예약 리스트 반환
export async function GET() {
  try {
    const raw = await redis.get(KEY)
    const list = raw ? JSON.parse(raw as string) : []
    return NextResponse.json(list)
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to get reservations", detail: e.message },
      { status: 500 }
    )
  }
}

// POST: 예약 생성
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

    // 기존 예약 리스트 읽기
    const raw = await redis.get(KEY)
    const list = raw ? JSON.parse(raw as string) : []

    // 새 예약 push
    const reservation = {
      id: uuid(),
      name,
      phone,
      guests: guests ?? null,
      start,
      end,
      status: "pending",   // 새 예약은 항상 대기 상태
      createdAt: new Date().toISOString()
    }

    list.push(reservation)

    // 저장
    await redis.set(KEY, JSON.stringify(list))

    return NextResponse.json({ ok: true, reservation })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to save", detail: e.message },
      { status: 500 }
    )
  }
}
