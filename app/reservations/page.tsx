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

  // 확정된 예약만 추출해서 예약된 날짜 범위 배열 만들기
  const getBookedDateRanges = () => {
    return list
      .filter((item) => item.status === "confirmed")
      .map((item) => ({
        start: new Date(item.start),
        end: new Date(item.end),
      }));
  };

  // 특정 날짜가 확정 예약 범위에 속하는지 확인
  const isDateBooked = (date: Date) => {
    const ranges = getBookedDateRanges();
    return ranges.some((range) =>
      isWithinInterval(date, { start: range.start, end: addDays(range.end, -1) }) // 퇴실일은 체크아웃이라 포함 안 함
    );
  };

  // 날짜 선택 제한 (이미 예약된 날짜 비활성화)
  const getDateProps = (date: Date) => {
    if (isDateBooked(date)) {
      return {
        disabled: true,
        style: { backgroundColor: "#dbeafe", color: "#6366f1", cursor: "not-allowed" },
        className: "booked-date",
      };
    }
    return {};
  };

  // 예약 목록 불러오기
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

  // 예약 제출
  async function submit() {
    if (!name || !phone || !start || !end) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 날짜 유효성 + 중복 체크
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
      setPhone("");
      setGuests(1);
      setStart("");
      setEnd("");
      loadReservations();
    } else {
      alert(`예약 실패: ${result.error || "알 수 없는 오류"}`);
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "42px", fontWeight: "bold", marginBottom: "40px", textAlign: "center" }}>
        예약하기
      </h1>

      {/* 입력 폼 생략 (기존 그대로) */}
      {/* ... 기존 입력 폼 코드 그대로 ... */}

      <label style={bigLabel}>입실 날짜</label>
      <input
        type="date"
        style={bigInput}
        value={start}
        onChange={(e) => setStart(e.target.value)}
        min={format(new Date(), "yyyy-MM-dd")}
        {...getDateProps(new Date(start || new Date()))}
      />

      <label style={bigLabel}>퇴실 날짜</label>
      <input
        type="date"
        style={bigInput}
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        min={start ? format(addDays(new Date(start), 1), "yyyy-MM-dd") : ""}
        {...getDateProps(new Date(end || new Date()))}
      />

      <button onClick={submit} style={{ /* 기존 버튼 스타일 */ }}>
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
                  padding: "20px",
                  background: "#e0e7ff",
                  borderRadius: "12px",
                  marginBottom: "12px",
                  fontSize: "19px",
                  lineHeight: "1.7",
                }}
              >
                <div><strong>이름:</strong> {maskName(v.name)}</div>
                <div><strong>연락처:</strong> {maskPhone(v.phone)}</div>
                <div><strong>인원:</strong> {v.guests}명</div>
                <div><strong>기간:</strong> {v.start} ~ {v.end} (확정)</div>
              </div>
            ))}
        </div>
      )}

      <style jsx>{`
        .booked-date {
          background-color: #dbeafe !important;
          color: #6366f1 !important;
          pointer-events: none;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}

// 이름/전화번호 마스킹 함수 (기존 그대로 유지)
const maskPhone = (phone: string) => { /* 기존 코드 */ };
const maskName = (name: string) => { /* 기존 코드 */ };