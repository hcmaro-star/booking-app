"use client";

import { useState, useEffect } from "react";

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

  // 첫 로딩 시 예약 목록 가져옴
  useEffect(() => {
    loadReservations();
  }, []);

  // 예약 제출
  async function submit() {
    if (!name || !phone || !start || !end) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, guests, start, end }),
      });

      const json = await res.json();
      if (json.ok) {
        alert("예약 완료되었습니다!");
        loadReservations();
      } else {
        alert("예약 실패: " + json.detail);
      }
    } catch (e) {
      alert("서버 오류 발생");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: 32, fontWeight: "bold" }}>예약하기</h1>

      <div style={{ marginTop: 20 }}>
        <p>이름</p>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <p>전화번호</p>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />

        <p>인원</p>
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          min={1}
        />

        <p>시작 날짜</p>
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />

        <p>종료 날짜</p>
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />

        <button
          onClick={submit}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "black",
            color: "white",
            borderRadius: 8,
            border: "none",
          }}
        >
          예약하기
        </button>
      </div>

      <h2 style={{ marginTop: 50, fontSize: 24, fontWeight: "bold" }}>예약 현황</h2>

      {list.length === 0 && <p>현재 예약이 없습니다.</p>}

      {list.map((r, idx) => (
        <div key={idx} style={{ marginTop: 15 }}>
          <p>
            {r.name} / {r.phone} / {r.start} ~ {r.end} / {r.guests}명
          </p>
        </div>
      ))}
    </div>
  );
}
