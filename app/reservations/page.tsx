"use client";

import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { ko } from "date-fns/locale";
import { addDays, isSameDay, startOfDay, eachDayOfInterval } from "date-fns";
import "react-date-range/dist/styles.css";
import "app/reservations/calendar.css"; // 커스텀 CSS

export default function ReservationsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);
  const [list, setList] = useState<any[]>([]);

  const bookedRanges = list
    .filter((r) => r.status === "confirmed")
    .map((r) => ({
      start: startOfDay(new Date(r.start)),
      end: startOfDay(new Date(r.end)),
    }));

  const getDayClassName = (date: Date) => {
    const d = startOfDay(date);
    for (const b of bookedRanges) {
      if (isSameDay(d, b.start)) return "check-in-day";
      if (isSameDay(d, addDays(b.end, -1)) && !isSameDay(d, b.start)) return "check-out-day";
      const days = eachDayOfInterval({ start: b.start, end: addDays(b.end, -1) });
      if (days.length > 1 && days.some((day) => isSameDay(day, d))) return "full-booked-day";
    }
    return "";
  };

  const hasOverlap = () => {
    const newStart = startOfDay(range[0].startDate);
    const newEnd = startOfDay(range[0].endDate);
    return bookedRanges.some((b) => newStart < b.end && newEnd > b.start);
  };

  useEffect(() => {
    fetch("/api/reservations").then(r => r.json()).then(data => Array.isArray(data) && setList(data));
  }, []);

  const submit = async () => {
    if (!name || !phone) return alert("이름과 전화번호를 입력해 주세요.");
    if (hasOverlap()) return alert("해당 기간에 이미 예약이 있습니다.");

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        guests,
        start: range[0].startDate.toISOString().split("T")[0],
        end: range[0].endDate.toISOString().split("T")[0],
      }),
    });

    if ((await res.json()).ok) {
      alert("예약 완료!");
      location.reload();
    }
  };

  const bigInput = { padding: "18px", fontSize: "20px", width: "100%", marginBottom: "20px", border: "1px solid #ccc", borderRadius: "8px" };

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "42px", fontWeight: "bold", textAlign: "center", marginBottom: "40px" }}>
        예약하기
      </h1>

      <input style={bigInput} placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
      <input style={bigInput} placeholder="전화번호" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input style={bigInput} type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />

      <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 30px rgba(0,0,0,0.1)", margin: "40px 0" }}>
        <DateRangePicker
          ranges={range}
          onChange={(item) => setRange([item.selection as any])}
          minDate={new Date()}
          locale={ko}
          months={2}
          direction="horizontal"
          dayContentRenderer={(date) => (
            <div className={getDayClassName(date)} style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {date.getDate()}
            </div>
          )}
        />
      </div>

      <div style={{ textAlign: "center", fontSize: "20px", marginBottom: "30px" }}>
        선택: {range[0].startDate.toLocaleDateString("ko-KR")} ~ {range[0].endDate.toLocaleDateString("ko-KR")}
      </div>

      <button onClick={submit} style={{ padding: "20px", fontSize: "24px", background: "#222", color: "#fff", width: "100%", borderRadius: "12px" }}>
        예약하기
      </button>

      {/* 예약 현황은 기존과 동일하게 유지하시면 됩니다 */}
    </div>
  );
}