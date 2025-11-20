import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hcmaro@gmail.com";

export const revalidate = 0;
const KEY = "reservations";

function toJsonString(raw: any): string {
  if (!raw || raw === "") return "[]";
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object" && typeof raw.result === "string") return raw.result;
  if (raw && typeof raw === "object" && typeof raw.data === "string") return raw.data;
  if (Array.isArray(raw)) return JSON.stringify(raw);
  return "[]";
}

// GET
export async function GET() {
  try {
    const raw = await redis.get(KEY);
    const json = toJsonString(raw);
    const list = JSON.parse(json);

    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to load", detail: e.message },
      { status: 500 }
    );
  }
}

// POST - 예약 생성 + 무조건 오는 이메일
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
    const json = toJsonString(raw);
    const list = JSON.parse(json);

    const newItem = {
      id: Date.now().toString(),
      name,
      phone,
      guests: Number(guests ?? 1),
      start,
      end,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    list.push(newItem);
    await redis.set(KEY, JSON.stringify(list));

    // ────────────────── 여기서 무조건 오는 메일 발송 ──────────────────
    try {
      await resend.emails.send({
        from: "veentee <hcmaro@gmail.com>",   // ← 이게 핵심! 본인 Gmail로 발송
        to: [ADMIN_EMAIL],
        subject: `새 예약 | ${name} (${start}~${end})`,
        html: `
          <h2>새 예약이 들어왔습니다!</h2>
          <p><strong>이름:</strong> ${name}</p>
          <p><strong>전화번호:</strong> ${phone}</p>
          <p><strong>인원:</strong> ${guests ?? 1}명</p>
          <p><strong>입실:</strong> ${start}</p>
          <p><strong>퇴실:</strong> ${end}</p>
          <p><strong>시간:</strong> ${new Date().toLocaleString("ko-KR")}</p>
          <br>
          <a href="https://veentee.com/admin/reservations" style="background:#000;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;">
            관리자 페이지 바로가기
          </a>
        `,
      });
    } catch (emailErr) {
      console.error("메일 발송 실패:", emailErr);
      // 실패해도 예약은 성공 처리
    }

    return NextResponse.json({ ok: true, reservation: newItem });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to save", detail: e.message },
      { status: 500 }
    );
  }
}