"use client";

import { useEffect, useState } from "react";

// 예약 데이터 타입
type Reservation = {
  name: string;
  phone: string;
  guests: number;
  start: string;
  end: string;
};

export default function ReservationsPage() {
  // 예약 목록 상태
  const [list, setList] = useState<Reservation[]>([]);

  // 예약 목록 불러오기 함수
  const loadReservations = async () => {
    try {
      const res = await fetch("/api/reservations", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setList(data as Reservation[]);
      }
    } catch (e) {
      console.error("불러오기 실패", e);
    }
  };

  // 페이지 로드시 예약 목록 불러오기
  useEffect(() => {
    loadReservations();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>예약 현황</h1>

      {list.length === 0 && (
        <p style={{ marginTop: 20 }}>현재 예약이 없습니다.</p>
      )}

      {list.length > 0 && (
        <ul style={{ marginTop: 20 }}>
          {list.map((item, i) => (
            <li key={i} style={{ marginBottom: 15 }}>
              <strong>{item.name}</strong> / {item.phone} / {item.guests}명 <br />
              {item.start} → {item.end}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
