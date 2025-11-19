"use client";

import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { ko } from "date-fns/locale";
import { addDays, eachDayOfInterval, isSameDay } from "date-fns";
import "react-date-range/dist/styles.css"; // 기본 스타일
import "./custom-calendar.css"; // 아래에서 만들어 드릴 커스텀 CSS 파일

export default function ReservationsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [selection, setSelection] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: "selection",
  });
  const [list, setList] = useState<any[]>([]);

  // 확정된 예약 범위 가져오기
  const getBookedRanges = () => {
    return list
      .filter((item) => item.status === "confirmed")
      .map((item) => ({
        start: new Date(item.start),
        end: new Date(item.end),
      }));
  };

  // 날짜 스타일 결정 (왼쪽/오른쪽/전체 파란색)
  const dayStyle = (date: Date) => {
    const ranges = getBookedRanges();

    for (const range of ranges) {
      const days = eachDayOfInterval({ start: range.start, end: addDays(range.end, -1) });

      if (isSameDay(date, range.start)) {
        return { className: "check-in-day" }; // 입실일 → 오른쪽만 파란색
      }
      if (isSameDay(date, addDays(range.end, -1))) {
        return { className: "check-out-day" }; // 퇴실 전날 → 왼쪽만 파란색
      }
      if (days.some((d) => isSameDay(d, date)) && days.length > 1) {
        return { className: "full-booked-day" }; // 중간일 → 전체 파란색
      }
    }
    return {};
  };

  // 중복 체크 (제출 시)
  const hasOverlap = () => {
    const newStart = selection.startDate;
    const newEnd = selection.endDate;

    return getBookedRanges().some((range) => {
      return (
        (newStart >= range.start && newStart < range.end) ||
        (newEnd > range.start && newEnd <= range.end) ||
        (newStart <= range.start && newEnd >= range.end)
      );
    });
  };

  // 나머지 로직은 기존과 동일
  async function loadReservations() { /* 기존 코드 */ }
  useEffect(() => { loadReservations(); }, []);

  async function submit() {
    if (!name || !phone) {
      alert("이름과 전화번호를 입력해 주세요.");
      return;
    }
    if (hasOverlap()) {
      alert("선택하신 기간에 이미 예약이 있습니다. 다른 날짜를 선택해 주세요.");
      return;
    }
    // 예약 POST 로직 (기존 그대로)
  }

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "42px", fontWeight: "bold", textAlign: "center", marginBottom: "40px" }}>
        예약하기
      </h1>

      <label style={bigLabel}>이름</label>
      <input style={bigInput} value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" />

      <label style={bigLabel}>전화번호</label>
      <input style={bigInput} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01012345678" />

      <label style={bigLabel}>인원</label>
      <input style={bigInput} type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />

      <label style={bigLabel}>숙박 기간 선택</label>
      <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", marginBottom: "30px" }}>
        <DateRange
          editableDateInputs={true}
          moveRangeOnFirstSelection={false}
          className="custom-calendar"
          minDate={new Date()}
          locale={ko}
          ranges={[selection]}
          onChange={(item) => setSelection(item.selection as any)}
          dayContentRenderer={(date) => (
            <div {...dayStyle(date)} style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {date.getDate()}
            </div>
          )}
          disabledDates={[] /* 실제로 비활성화는 CSS로 처리 */}
        />
      </div>

      <div style={{ fontSize: "18px", marginBottom: "20px", textAlign: "center" }}>
        선택 기간: {selection.startDate.toLocaleDateString("ko-KR")} ~ {selection.endDate.toLocaleDateString("ko-KR")}
      </div>

      <button onClick={submit} style={{ padding: "20px", fontSize: "24px", background: "#222", color: "white", width: "100%", borderRadius: "12px" }}>
        예약하기
      </button>

      {/* 예약 현황은 기존 그대로 */}
    </div>
  );
}