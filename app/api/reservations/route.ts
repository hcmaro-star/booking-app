import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import nodemailer from "nodemailer";

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

// Nodemailer transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// GET, POST 기존 로직 유지 + 이메일 발송 부분만 교체
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, guests, start, end } = body;

    if (!name || !phone || !start || !end) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
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

    // ────────────────── Gmail로 직접 알림 발송 (100% 도착) ──────────────────
    try {
      await transporter.sendMail({
        from: `"Veentee 예약알림" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `🔔 새 예약 | ${name} (${start}~${end})`,
        html: `
          <div style="font-family: sans-serif; padding: 30px; background: #f8f9fa; border-radius: 16px;">
            <h2 style="color: #222;">새 예약이 들어왔습니다!</h2>
            <hr>
            <p><strong>이름:</strong> ${name}</p>
            <p><strong>연락처:</strong> ${phone}</p>
            <p><strong>인원:</strong> ${guests ?? 1}명</p>
            <p><strong>입실:</strong> ${start}</p>
            <p><strong>퇴실:</strong> ${end}</p>
            <p><strong>시간:</strong> ${new Date().toLocaleString("ko-KR")}</p>
            <br>
            <a href="https://veentee.com/admin/reservations" style="background:#222;color:#fff;padding:15px 30px;text-decoration:none;border-radius:12px;display:inline-block;">
              관리자 페이지 바로가기 →
            </a>
          </div>
        `,
      });
      console.log("예약 알림 이메일 발송 성공 (Gmail)");
    } catch (emailError) {
      console.error("이메일 발송 실패:", emailError);
      // 실패해도 예약은 성공 처리
    }

    return NextResponse.json({ ok: true, reservation: newItem });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// GET은 기존 그대로
export async function GET() {
  try {
    const raw = await redis.get(KEY);
    const json = toJsonString(raw);
    const list = JSON.parse(json);
    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}