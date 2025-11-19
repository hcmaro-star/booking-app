"use client";

import { useEffect, useState } from "react";

export default function AdminReservationsPage() {
  const [list, setList] = useState<any[]>([]);

  // --- 전화번호 마스킹 함수 (관리자만 마우스 올리면 진짜 번호 보임) ---
  const maskPhone = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}****${cleaned.slice(-4)}`;
    }
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}***${cleaned.slice(-4)}`;
    }
    return phone; // 이상한 번호면 그대로
  };

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
      load();
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
    <div style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 30 }}>관리자 예약 목록</h1>

      <table
        border={1}
        cellPadding={12}
        style={{
          width: "100%",
          maxWidth: 1100,
          margin: "0 auto",
          borderCollapse: "collapse",
          background: "#fff",
        }}
      >
        <thead style={{ background: "#f7f7f7" }}>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>연락처</th>
            <th>인원</th>
            <th>숙박 기간</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: 40 }}>
                예약 내역이 없습니다.
              </td>
            </tr>
          ) : (
            list.map((item: any) => (
              <tr key={item.id} style={{ textAlign: "center" }}>
                <td>{item.id}</td>
                <td>{item.name}</td>

                {/* ★★★ 여기만 바뀌었음! ★★★ */}
                <td style={{ position: "relative" }}>
                  <span
                    style={{
                      cursor: "pointer",
                      fontFamily: "monospace",
                      padding: "4px 8px",
                      background: "#f0f0f0",
                      borderRadius: 6,
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(item.phone);
                      alert("전화번호 복사됨: " + item.phone);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.title = item.phone;
                    }}
                  >
                    {maskPhone(item.phone)}
                  </span>

                  {/* 호버 시 진짜 번호 툴팁 */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-40px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0,0,0,0.85)",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: 6,
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      opacity: 0,
                      pointerEvents: "none",
                      transition: "opacity 0.2s",
                      zIndex: 10
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                  >
                    {item.phone} ← 클릭하면 복사
                  </div>
                </td>

                <td>{item.guests}명</td>
                <td>
                  {item.start} ~ {item.end}
                </td>
                <td>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: "bold",
                      background:
                        item.status === "confirmed"
                          ? "#d4edda"
                          : item.status === "cancelled"
                          ? "#f8d7da"
                          : "#fff3cd",
                      color:
                        item.status === "confirmed"
                          ? "#155724"
                          : item.status === "cancelled"
                          ? "#721c24"
                          : "#856404",
                    }}
                  >
                    {item.status === "confirmed"
                      ? "확정"
                      : item.status === "cancelled"
                      ? "취소"
                      : "대기중"}
                  </span>
                </td>

                <td>
                  {item.status === "pending" && (
                    <button
                      onClick={() => confirmReservation(item.id)}
                      style={{
                        marginRight: 8,
                        padding: "6px 12px",
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      확정
                    </button>
                  )}

                  {item.status !== "cancelled" && (
                    <button
                      onClick={() => cancelReservation(item.id)}
                      style={{
                        padding: "6px 12px",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      취소
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}