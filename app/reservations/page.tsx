"use client";

import { useEffect, useState } from "react";
import { format, isWithinInterval, isBefore, isAfter, addDays } from "date-fns";

export default function ReservationsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [list, setList] = useState<any[]>([]);

  // ────────────────── 스타일 정의 (필수!) ──────────────────
  const bigInput = {
    padding: "18px",
    fontSize: "20px",
    width: "100%",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  } as const;

  const bigLabel = {
    fontSize: "24px",
    fontWeight: "bold" as const,
    marginBottom: "8px",
    display: "block" as const,
  } as const;

  // ────────────────── 예약된 날짜 처리 로직 ──────────────────
  const getBookedDateRanges = () => {
    return list
      .filter((item) => item.status === "confirmed")
      .map((item) => ({
        start: new Date(item.start),
        end: new Date(item.end),
      }));
  };

  const isDateBooked = (date: Date) => {
    const ranges = getBookedDateRanges();
    return ranges.some((range) =>
      isWithinInterval(date, { start: range.start, end: addDays(range.end, -1) })
    );
  };

  // ────────────────── 예약 목록 불러오기 ──────────────────
  async function loadReservations() {
    try {
      const res = await fetch("/api/reservations");
      const data = await res.json();
      if (Array.isArray(data)) setList(data);
    } catch (e) {}
  }

  useEffect(() => {
    loadReservations();
  }, []);

  // ────────────────── 예약 제출 ──────────────────
  async function submit() {
    if (!name || !phone || !start || !end) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isBefore(endDate, addDays(startDate, 1))) {
      alert("퇴실 날짜는 입실 다음 날 이후여야 합니다.");
      return;
    }

    const bookedRanges = getBookedDateRanges();
    const hasOverlap = bookedRanges.some((range) =>
      isBefore(startDate, range.end) && isAfter(endDate, range.start)
    );

    if (hasOverlap) {
      alert("선택하신 기간에 이미 확정된 예약이 있습니다.");
      return;
    }

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ name, phone, guests, start, end }),
    });

    const result = await res.json();
    if (result.ok) {
      alert("예약 완료!");
      setName("");
      setPhone("");
      setGuests(1);
      setStart("");
      setEnd("");
      loadReservations();
    } else {
      alert(`예약 실패: ${result.error || "알 수 없는 오류"}`);
    }
  }

  // ────────────────── 이름/전화번호 마스킹 ──────────────────
  const maskPhone = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.length >= 10) {
      return `${cleaned.slice(0, 3)}****${cleaned.slice(-4)}`;
    }
    return "****";
  };

  const maskName = (name: string) => {
    if (name.length <= 2) return name[0] + "*".repeat(name.length - 1);
    return name[0] + "*".repeat(name.length - 2) + name.slice(-1);
  };

  // ────────────────── JSX ──────────────────
  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "42px", fontWeight: "bold", marginBottom: "40px", textAlign: "center" }}>
        예약하기
      </h1>

      <label style={bigLabel}>이름</label>
      <input style={bigInput} placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />

      <label style={bigLabel}>전화번호</label>
      <input style={bigInput} placeholder="전화번호" value={phone} onChange={(e) => setPhone(e.target.value)} />

      <label style={bigLabel}>인원 수</label>
      <input style={bigInput} type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />

      <label style={bigLabel}>입실 날짜</label>
      <input
        type="date"
        style={{ ...bigInput, backgroundColor: start && isDateBooked(new Date(start)) ? "#dbeafe" : "" }}
        value={start}
        min={format(new Date(), "yyyy-MM-dd")}
        onChange={(e) => setStart(e.target.value)}
        disabled={start && isDateBooked(new Date(start))}
      />

      <label style={bigLabel}>퇴실 날짜</label>
      <input
        type="date"
        style={{ ...bigInput, backgroundColor: end && isDateBooked(new Date(end)) ? "#dbeafe" : "" }}
        value={end}
        min={start ? format(addDays(new Date(start), 1), "yyyy-MM-dd") : ""}
        onChange={(e) => setEnd(e.target.value)}
        disabled={end && isDateBooked(new Date(end))}
      />

      <button
        onClick={submit}
        style={{
          padding: "20px",
          fontSize: "24px",
          background: "#444",
          color: "#fff",
          width: "100%",
          borderRadius: "10px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        예약하기
      </button>

      {/* 예약 현황 */}
      <h2 style={{ marginTop: "80px", fontSize: "36px", fontWeight: "bold", textAlign: "center" }}>
        예약 현황
      </h2>

      {list.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "20px", color: "#666", marginTop: "30px" }}>
          현재 예약이 없습니다.
        </p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {list
            .filter((v) => v.status === "confirmed")
            .map((v, i) => (
              <div
                key={i}
                style={{
                  padding: "24px",
                  background: "#e0e7ff",
                  borderRadius: "16px",
                  marginBottom: "16px",
                  fontSize: "20px",
                  lineHeight: "1.8",
                }}
              >
                <div><strong>이름:</strong> {maskName(v.name)}</div>
                <div><strong>연락처:</strong> {maskPhone(v.phone)}</div>
                <div><strong>인원:</strong> {v.guests}명</div>
                <div><strong>날짜:</strong> {v.start} ~ {v.end}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}