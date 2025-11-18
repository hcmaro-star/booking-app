"use client";

import { useEffect, useState } from "react";

export default function ReservationsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [list, setList] = useState<any[]>([]);

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

  const res = await fetch("/api/reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    cache: "no-store",        // 🔥 JSON 파싱 오류 방지
    body: JSON.stringify({ name, phone, guests, start, end }),
  });

  let result;
  try {
    result = await res.json();
  } catch (e) {
    console.error("JSON 파싱 실패:", e);
    alert("서버 응답 오류(JSON). 예약 실패.");
    return;
  }

  if (result.ok) {
    alert("예약 완료!");
  } else {
    alert(`예약 실패: ${result.error || "알 수 없는 오류"}`);
  }
}


  // 공통 스타일
  const bigInput = {
    padding: "18px",
    fontSize: "20px",
    width: "100%",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  };

  const bigLabel = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "8px",
    display: "block",
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "42px",
          fontWeight: "bold",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        예약하기
      </h1>

      {/* 입력 form */}
      <div>
        <label style={bigLabel}>이름</label>
        <input
          style={bigInput}
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label style={bigLabel}>전화번호</label>
        <input
          style={bigInput}
          placeholder="전화번호"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label style={bigLabel}>인원 수</label>
        <input
          style={bigInput}
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />

        <label style={bigLabel}>입실 날짜</label>
        <input
          type="date"
          style={bigInput}
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <label style={bigLabel}>퇴실 날짜</label>
        <input
          type="date"
          style={bigInput}
          value={end}
          onChange={(e) => setEnd(e.target.value)}
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
            marginTop: "10px",
          }}
        >
          예약하기
        </button>
      </div>

      {/* 예약 목록 */}
      <h2
        style={{
          marginTop: "60px",
          fontSize: "36px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        예약 현황
      </h2>

      {list.length === 0 ? (
        <p style={{ fontSize: "22px", textAlign: "center", marginTop: "20px" }}>
          현재 예약이 없습니다.
        </p>
      ) : (
        list.map((v, i) => (
          <div
            key={i}
            style={{
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              marginTop: "20px",
              fontSize: "22px",
            }}
          >
            <div>이름: {v.name}</div>
            <div>전화번호: {v.phone}</div>
            <div>인원: {v.guests}</div>
            <div>
              날짜: {v.start} ~ {v.end}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
