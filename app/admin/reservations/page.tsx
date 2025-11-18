"use client";
import { useEffect, useState } from "react";

export default function AdminReservationsPage() {
  const [list, setList] = useState([]);

  // 예약 조회
  async function load() {
    const res = await fetch("/api/reservations");
    const data = await res.json();
    setList(data);
  }

  // 페이지 로드시 예약 목록 로딩
  useEffect(() => {
    load();
  }, []);

  // 예약 확정 호출
  async function confirmReservation(id: string) {
    await fetch("/api/reservations/confirm", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    alert("확정 완료");
    load(); // 다시 불러오기
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>관리자 예약 목록</h1>

      {list.length === 0 && <p>예약 없음</p>}

      {list.map((r: any) => (
        <div
          key={r.id}
          style={{
            padding: 12,
            marginBottom: 10,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        >
          <p><b>이름:</b> {r.name}</p>
          <p><b>전화:</b> {r.phone}</p>
          <p><b>날짜:</b> {r.start} → {r.end}</p>
          <p><b>상태:</b> {r.status}</p>

          {r.status !== "confirmed" && (
            <button onClick={() => confirmReservation(r.id)}>
              예약 확정
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
