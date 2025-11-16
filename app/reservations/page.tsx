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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, guests, start, end }),
    });

    const result = await res.json();

    if (result.ok) {
      alert("예약 완료!");
      loadReservations();
      setName("");
      setPhone("");
      setGuests(1);
      setStart("");
      setEnd("");
    } else {
      alert("예약 실패: " + result.detail);
    }
  }

  // 스타일 2배 확대
  const bigText = { fontSize: "32px", marginBottom: "20px" };
  const bigInput = { padding: "20px", fontSize: "20px", marginBottom: "20px" };

  return (
    <div style={{ padding: "50px" }}>
      <h1 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "30px" }}>
        예약하기
      </h1>

      {/* 입력폼 */}
      <div style={{ maxWidth: "600px" }}>
        <input
          style={bigInput}
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={bigInput}
          placeholder="전화번호"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          style={bigInput}
          type="number"
          placeholder="인원"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
        <label style={bigText}>입실 날짜</label>
        <input
          type="date"
          style={bigInput}
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <label style={bigText}>퇴실 날짜</label>
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
            fontSize: "22px",
            background: "#444",
            color: "#fff",
            borderRadius: "10px",
            marginTop: "20px",
          }}
        >
          예약하기
        </button>
      </div>

      {/* 예약 목록 */}
      <h2 style={{ marginTop: "60px", fontSize: "36px" }}>예약 현황</h2>

      {list.length === 0 ? (
        <p style={{ fontSize: "22px" }}>현재 예약이 없습니다.</p>
      ) : (
        list.map((v, i) => (
          <div
            key={i}
            style={{
              padding: "20px",
              border: "1px solid #ddd",
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

