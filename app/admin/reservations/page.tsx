"use client";

import { useEffect, useState } from "react";

export default function AdminReservationsPage() {
  const [list, setList] = useState<any[]>([]);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const ADMIN_PASSWORD = "6897"; // 고객님 비밀번호

  const checkPassword = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem("admin-auth", "true");
    } else {
      alert("비밀번호가 틀렸습니다!");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("admin-auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  const maskPhone = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    return cleaned.length === 11 ? `${cleaned.slice(0, 3)}****${cleaned.slice(-4)}` : phone;
  };

  const load = async () => {
    const res = await fetch("/api/reservations");
    const data = await res.json();
    setList(data);
  };

  useEffect(() => {
    if (authenticated) load();
  }, [authenticated]);

  // 확정 (즉시 반영)
  async function confirmReservation(id: string) {
    if (!confirm("정말 확정하시겠습니까?")) return;

    const res = await fetch("/api/reservations/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();
    if (result.ok) {
      alert("확정 완료되었습니다.");
      setList((prev) => prev.map(item => item.id === id ? { ...item, status: "confirmed" } : item));
    } else {
      alert("확정 실패: " + result.error);
    }
  }

  // 취소 (즉시 반영)
  async function cancelReservation(id: string) {
    if (!confirm("정말 취소하시겠습니까?")) return;

    const res = await fetch("/api/reservations/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();
    if (result.ok) {
      alert("취소 완료되었습니다.");
      setList((prev) => prev.map(item => item.id === id ? { ...item, status: "cancelled" } : item));
      // 또는 완전 삭제하고 싶다면 아래 줄 사용
      // setList((prev) => prev.filter(item => item.id !== id));
    } else {
      alert("취소 실패: " + result.error);
    }
  }

  if (!authenticated) {
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#111", color: "#fff" }}>
        <h1 style={{ fontSize: "42px", marginBottom: "50px" }}>관리자 로그인</h1>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && checkPassword()} style={{ padding: "20px", fontSize: "24px", width: "340px", borderRadius: "12px", border: "none", textAlign: "center", marginBottom: "20px" }} placeholder="비밀번호" />
        <button onClick={checkPassword} style={{ padding: "16px 48px", fontSize: "20px", background: "#fff", color: "#000", border: "none", borderRadius: "12px" }}>로그인</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, fontFamily: "system-ui, sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 30 }}>관리자 예약 목록</h1>
      <button onClick={() => { localStorage.removeItem("admin-auth"); setAuthenticated(false); }} style={{ position: "absolute", top: 20, right: 20, padding: "10px 20px", background: "#333", color: "#fff", border: "none", borderRadius: 8 }}>로그아웃</button>

      <table style={{ width: "100%", maxWidth: 1200, margin: "0 auto", borderCollapse: "collapse", background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <thead style={{ background: "#222", color: "#fff" }}>
          <tr>
            <th style={{ padding: 16 }}>ID</th>
            <th style={{ padding: 16 }}>이름</th>
            <th style={{ padding: 16 }}>연락처</th>
            <th style={{ padding: 16 }}>인원</th>
            <th style={{ padding: 16 }}>숙박 기간</th>
            <th style={{ padding: 16 }}>상태</th>
            <th style={{ padding: 16 }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item: any) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee", textAlign: "center" }}>
              <td style={{ padding: 16 }}>{item.id}</td>
              <td style={{ padding: 16, fontWeight: "bold" }}>{item.name}</td>
              <td style={{ padding: 16 }}>
                <span style={{ cursor: "pointer", background: "#f0f0f0", padding: "6px 12px", borderRadius: 6 }} onClick={() => { navigator.clipboard.writeText(item.phone); alert("복사됨: " + item.phone); }}>
                  {maskPhone(item.phone)}
                </span>
              </td>
              <td style={{ padding: 16 }}>{item.guests}명</td>
              <td style={{ padding: 16 }}>{item.start} ~ {item.end}</td>
              <td style={{ padding: 16 }}>
                <span style={{
                  padding: "6px 14px", borderRadius: 20, fontWeight: "bold", fontSize: 14,
                  background: item.status === "confirmed" ? "#d4edda" : item.status === "cancelled" ? "#f8d7da" : "#fff3cd",
                  color: item.status === "confirmed" ? "#155724" : item.status === "cancelled" ? "#721c24" : "#856404"
                }}>
                  {item.status === "confirmed" ? "확정" : item.status === "cancelled" ? "취소" : "대기중"}
                </span>
              </td>
              <td style={{ padding: 16 }}>
                {item.status === "pending" && (
                  <button onClick={() => confirmReservation(item.id)} style={{ marginRight: 8, padding: "8px 16px", background: "#28a745", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
                    확정
                  </button>
                )}
                {item.status !== "cancelled" && (
                  <button onClick={() => cancelReservation(item.id)} style={{ padding: "8px 16px", background: "#dc3545", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
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