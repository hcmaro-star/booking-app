"use client";

import { useEffect, useState } from "react";

export default function AdminReservationsPage() {
  const [list, setList] = useState([]);

  // --- 예약 목록 불러오기 ---
  async function load() {
    const res = await fetch("/api/reservations");
    const data = await res.json();
    setList(data);
  }

  useEffect(() => {
    load();
  }, []);

  // --- 예약 확정 ---
  async function confirmReservation(id: string) {
    const res = await fetch("/api/reservations/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();
    if (result.ok) {
      alert("확정 완료");
      load(); // 새로고침
    } else {
      alert("확정 실패: " + result.error);
    }
  }

  // --- 예약 취소 ---
  async function cancelReservation(id: string) {
    const res = await fetch("/api/reservations/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();
    if (result.ok) {
      alert("취소 완료");
      load();
    } else {
      alert("취소 실패: " + result.error);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>관리자 예약 목록</h1>

      <table border={1} cellPadding={8} style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>전화</th>
            <th>인원</th>
            <th>날짜</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {list.map((item: any) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td>{item.guests}</td>
              <td>
                {item.start} ~ {item.end}
              </td>
              <td>{item.status || "pending"}</td>

              <td>
                {item.status === "pending" && (
                  <button
                    onClick={() => confirmReservation(item.id)}
                    style={{ marginRight: 8 }}
                  >
                    확정
                  </button>
                )}

                {item.status !== "cancelled" && (
                  <button
                    onClick={() => cancelReservation(item.id)}
                    style={{ color: "red" }}
                  >
                    취소
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
