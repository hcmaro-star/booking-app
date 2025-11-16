"use client";

import { useState, useEffect } from "react";

export default function ReservationsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [list, setList] = useState([]);

  const nights =
    start && end ? Math.ceil((new Date(end) - new Date(start)) / 86400000) : 0;
  const price =
    nights * 85000 +
    (guests > 1 ? (guests - 1) * 35000 * nights : 0);

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

  async function submit() {
    const res = await fetch("/api/reservations", {
      method: "POST",
      body: JSON.stringify({ name, phone, guests, start, end }),
    });

    const data = await res.json();

    if (data.ok) {
      alert("예약 완료!");
      loadReservations();
    } else {
      alert("예약 실패: " + data.error);
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>숙소 예약</h1>

      <div style={{ marginTop: 30 }}>
        <label>예약자 이름</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 8 }}
        />

        <label style={{ marginTop: 20 }}>연락처</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 8 }}
        />

        <label style={{ marginTop: 20 }}>인원수</label>
        <input
          type="number"
          min={1}
          max={5}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          style={{ width: "100%", padding: 10, marginTop: 8 }}
        />

        <label style={{ marginTop: 20 }}>체크인</label>
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 8 }}
        />

        <label style={{ marginTop: 20 }}>체크아웃</label>
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 8 }}
        />

        <div style={{ marginTop: 20, fontWeight: "bold" }}>
          예상 요금: {price.toLocaleString()}원
        </div>

        <button
          onClick={submit}
          style={{
            marginTop: 30,
            width: "100%",
            padding: 15,
            background: "#222",
            color: "white",
            borderRadius: 8,
            border: "none",
            fontSize: 18,
          }}
        >
          예약하기
        </button>
      </div>

      <h2 style={{ marginTop: 50, fontSize: 24, fontWeight: "bold" }}>
        예약 현황
      </h2>

      {list.length === 0 && <p>현재 예약이 없습니다.</p>}

      <ul style={{ marginTop: 20 }}>
        {list.map((a: any) => (
          <li key={a.id} style={{ marginBottom: 10 }}>
            {a.start} → {a.end} / {a.name} / {a.guests}명
          </li>
        ))}
      </ul>
    </div>
  );
}
