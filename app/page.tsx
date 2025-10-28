"use client";
import { useEffect, useMemo, useState } from "react";
import { DayPicker, DateRange, Matcher } from "react-day-picker";
import { addDays, format } from "date-fns";

type Reservation = {
  id: string;
  name: string;
  phone: string;
  guests: number;
  start: string; // yyyy-MM-dd (check-in)
  end: string;   // yyyy-MM-dd (checkout, 미포함)
  createdAt: string;
};

const MAX_GUESTS = 5;
const fmt = (d: Date) => format(d, "yyyy-MM-dd");

function daysBetween(a: string, b: string) {
  return Math.max(0, Math.round((+new Date(b) - +new Date(a)) / 86400000));
}

export default function Page() {
  const [list, setList] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // 폼 상태
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);

  // 달력 선택 상태 (react-day-picker 용)
  const [range, setRange] = useState<DateRange | undefined>();

  // 서버 전송용 문자열 (기존 로직 유지: end = checkout(미포함))
  const start = range?.from ? fmt(range.from) : "";
  const end = range?.to ? fmt(addDays(range.to!, 1)) : "";

  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

async function refresh() {
  setLoading(true);
  setError(null);
  try {
    // 캐시를 쓰지 않고 항상 새로 가져오도록
    const r = await fetch("/api/reservations", { cache: "no-store" });
    if (!r.ok) {
      throw new Error(`API error: ${r.status}`);
    }

    const contentType = r.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("Invalid content-type");
    }

    const data = await r.json();

    // 응답 형식 방어적으로 정규화
    const safe: Reservation[] = Array.isArray(data)
      ? data
          .map((x: any) => ({
            id: String(x?.id ?? ""),
            name: String(x?.name ?? ""),
            phone: String(x?.phone ?? ""),
            guests: Number(x?.guests ?? 0),
            start: String(x?.start ?? ""),
            end: String(x?.end ?? ""),
            createdAt: String(x?.createdAt ?? ""),
          }))
          .filter((x) => x.id) // id 없는 항목 제거
      : [];

    setList(safe);
  } catch (e) {
    console.error("fetch reservations failed:", e);
    setList([]);
    setError("예약 목록을 불러오지 못했습니다.");
  } finally {
    setLoading(false);
  }
}

  useEffect(() => { refresh(); }, []);

  // 이미 예약된 구간을 달력에서 비활성화(선택 불가)
  // 예약의 end는 checkout(미포함)이므로, 달력에서 막을 때는 1일 빼서 포함 범위로 맞춰줌
  const disabledMatchers: Matcher[] = useMemo(() => {
    return list.map((r) => ({
      from: new Date(r.start),
      to: addDays(new Date(r.end), -1),
    }));
  }, [list]);

  // 1박 이상일 때만 유효
  const nights = start && end ? daysBetween(start, end) : 0;
  const basePerNight = 85000 + Math.max(0, guests - 1) * 35000;
  const subtotal = nights * basePerNight;
  const discountPct = nights >= 5 ? 20 : nights >= 3 ? 10 : 0;
  const total = Math.round(subtotal * (1 - discountPct / 100));

  async function submit() {
    setMsg(null);
    setError(null);

    if (!name.trim() || !phone.trim()) { setError("이름/연락처를 입력해 주세요."); return; }
    if (!range?.from || !range?.to) { setError("체크인/체크아웃 날짜를 달력에서 선택해 주세요."); return; }
    if (guests < 1 || guests > MAX_GUESTS) { setError(`인원은 1~${MAX_GUESTS}명입니다.`); return; }
    if (nights < 1) { setError("1박 이상만 예약 가능합니다."); return; }

    const r = await fetch("/api/reservations",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ name, phone, guests, start, end })
    });
    const data = await r.json();
    if (!r.ok) { setError(data?.error || "예약 실패"); return; }

    setMsg("임시 예약이 저장됐습니다. 사장님이 연락드립니다.");
    setName(""); setPhone(""); setGuests(1); setRange(undefined);
    refresh();
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>숙소 예약(간단)</h1>
      <p style={{ color: "#d80b0bff", marginBottom: 16 }}>
        예약만 남기세요. 결제는 연락 드려서 별도로 진행합니다.
      </p>

      <section style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>예약 정보</h2>

        {/* 달력: 모드 range / 예약된 날짜 disabled */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>체크인/체크아웃</div>
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={2}
              disabled={disabledMatchers}
              fromDate={new Date()}           // 오늘 이전 선택 방지(원하면 제거)
              captionLayout="dropdown"
              weekStartsOn={1}
            />
            <div style={{ marginTop: 8, fontSize: 13, color: "rgba(238, 101, 9, 1)" }}>
              {range?.from && range?.to
                ? `선택: ${fmt(range.from)} → ${fmt(addDays(range.to, 1))} (체크아웃)`
                : "달력에서 체크인과 체크아웃을 선택하세요"}
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8 }}>예약자 이름
              <input value={name} onChange={(e)=>setName(e.target.value)}
                     placeholder="홍길동" style={{ display:"block", width:"100%", padding:8, marginTop:6 }} />
            </label>
            <label style={{ display: "block", marginBottom: 8 }}>연락처
              <input value={phone} onChange={(e)=>setPhone(e.target.value)}
                     placeholder="010-1234-5678" style={{ display:"block", width:"100%", padding:8, marginTop:6 }} />
            </label>
            <label style={{ display: "block", marginBottom: 8 }}>인원(최대 5명)
              <input type="number" min={1} max={MAX_GUESTS} value={guests}
                     onChange={(e)=>setGuests(Math.min(MAX_GUESTS, Math.max(1, Number(e.target.value))))}
                     style={{ display:"block", width:"100%", padding:8, marginTop:6 }} />
            </label>

            <div style={{ marginTop: 12, fontSize: 14, color: "#444" }}>
              <div>숙박일수: <b>{nights}</b>박</div>
              <div>요금: 1인 85,000원 / 추가 1인·박 35,000원</div>
              <div>장기숙박 할인: 3박 10%, 5박 20%</div>
              {nights>0 && <div style={{ marginTop: 6 }}>예상 합계: <b>{total.toLocaleString()}원</b> ({discountPct}% 적용)</div>}
            </div>

            {error && <div style={{ color:"#b91c1c", marginTop:12 }}>{error}</div>}
            {msg   && <div style={{ color:"#065f46", marginTop:12 }}>{msg}</div>}

            <button onClick={submit}
                    style={{ marginTop: 16, padding:"10px 16px", borderRadius:8, background:"#111827", color:"#fff", border:0 }}>
              예약 남기기
            </button>
          </div>
        </div>
      </section>

      <section style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>예약 현황</h2>
        {loading ? (
          <div>불러오는 중…</div>
        ) : list.length===0 ? (
          <div>아직 예약이 없습니다.</div>
        ) : (
          <ul style={{ display:"grid", gap:10, listStyle:"none", padding:0 }}>
            {list.map(r=>(
              <li key={r.id} style={{ padding:12, border:"1px solid #e5e7eb", borderRadius:10 }}>
                <div><b>{r.start} → {r.end}</b> · {r.guests}명 · {r.name} (연락처비공개)</div>
                <div style={{ color:"hsla(246, 96%, 51%, 1.00)", fontSize:12 }}>생성: {new Date(r.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
        <p style={{ color:"#6b7280", fontSize:12, marginTop:8 }}>※ 겹치는 날짜는 서버가 자동 거절합니다.</p>
      </section>
     <style jsx global>{`
  /* react-day-picker 기본 클래스명을 이용한 간단 스타일 보강 */
  .rdp-day_disabled {
    opacity: 0.35;
    text-decoration: line-through;
    cursor: not-allowed;
  }
  /* 선택된 범위를 옅은 붉은색 배경으로 */
  .rdp-day_range_start,
  .rdp-day_range_end,
  .rdp-day_range_middle {
    background: #fee2e2 !important;  /* rose-100 */
  }
  .rdp-day_range_start button,
  .rdp-day_range_end button,
  .rdp-day_range_middle button {
    color: #7f1d1d !important;       /* rose-900 */
  }
`}</style> 
    </main>
  );
}



