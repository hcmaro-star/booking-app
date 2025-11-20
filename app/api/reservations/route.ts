import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hcmaro@gmail.com";

export const revalidate = 0;
const KEY = "reservations";

/** Upstash의 반환값을 문자열로 통일 */
function toJsonString(raw: any): string {
  if (!raw || raw === "") return "[]";
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object" && typeof raw.result === "string") return raw.result;
  if (raw && typeof raw === "object" && typeof raw.data === "string") return raw.data;
  if (Array.isArray(raw)) return JSON.stringify(raw);
  return "[]";
}

// GET: 전체 예약 조회
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

// POST: 예약 생성 + 관리자 이메일 알림
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

    // ────────────────── 관리자 이메일 알림 발송 (도메인 문제 우회) ──────────────────
    try {
      await resend.emails.send({
        from: "Veentee 예약알림 <hcmaro@gmail.com>",   // ← Gmail로 발송 (100% 도착 보장)
        to: ADMIN_EMAIL,
        subject: `🔔 새 예약 도착 | ${name}님 (${start} ~ ${end})`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #f9fafb; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
            <h2 style="color: #1f2937; margin-top: 0;">새 예약이 들어왔습니다!</h2>
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="margin: 12px 0; font-size: 16px;"><strong>이름:</strong> ${name}</p>
            <p style="margin: 12px 0; font-size: 16px;"><strong>연락처:</strong> ${phone}</p>
            <p style="margin: 12px 0; font-size: 16px;"><strong>인원:</strong> ${guests ?? 1}명</p>
            <p style="margin: 12px 0; font-size: 16px;"><strong>입실:</strong> ${start}</p>
            <p style="margin: 12px 0; font-size: 16px;"><strong>퇴실:</strong> ${end}</p>
            <p style="margin: 12px 0; font-size: 16px; color: #6b7280;"><strong>예약 시간:</strong> ${new Date().toLocaleString("ko-KR")}</p>
            <div style="margin-top: 30px; text-align: center;">
              <a href="https://veentee.com/admin/reservations" 
                 style="background: #111; color: white; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">
                관리자 페이지 바로가기 →
              </a>
            </div>
            <p style="margin-top: 30px; font-size: 14px; color: #9ca3af;">
              Veentee.com 자동 알림입니다.
            </p>
          </div>
        `,
      });
      console.log("예약 알림 이메일 발송 성공");
    } catch (emailError) {
      console.error("이메일 발송 실패 (예약은 정상 저장됨):", emailError);
      // 이메일 실패해도 예약은 성공 처리 (중요!)
    }

    return NextResponse.json({ ok: true, reservation: newItem });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to save", detail: e.message },
      { status: 500 }
    );
  }
}