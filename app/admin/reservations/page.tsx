"use client";

import { useEffect, useState } from "react";
import { format, addMonths } from "date-fns";

export default function AdminReservationsPage() {
  const [list, setList] = useState<any[]>([]);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // 필터
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(addMonths(new Date(), 1), "yyyy-MM-dd"));

  const ADMIN_PASSWORD = "6897"; // ← 여기 고객님 비밀번호로 변경

  const checkPassword = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem("admin-auth", "true");
    } else {
      alert("비밀번호가 틀렸습니다!");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("admin-auth") === "true") setAuthenticated(true);
  }, []);

  const maskPhone = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.length >= 10) return `${cleaned.slice(0, 3)}****${cleaned.slice(-4)}`;
    return phone;
  };

  const load = async () => {
    const res = await fetch("/api/reservations");
    const data = await res.json();
    setList(data || []);
  };

  useEffect(() => {
    if (authenticated) load();
  }, [authenticated]);

  // 확정 (중복 방지)
  async function confirmReservation(id: string) {
    const target = list.find(i => i.id === id);
    if (!target) return;

    const overlap = list.find(i => {
      if (i.id === id || i.status !== "confirmed") return false;
      return new Date(target.start) < new Date(i.end) && new Date(target.end) > new Date(i.start);
    });

    if (overlap) {
      alert(`확정 불가!\n이미 확정된 예약과 겹칩니다.\n이름: ${overlap.name}\n기간: ${overlap.start} ~ ${overlap.end}`);
      return;
    }

    if (!confirm(`${target.name}님 예약을 확정하시겠습니까?`)) return;

    const res = await fetch("/api/reservations/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if ((await res.json()).ok) {
      alert("확정 완료!");
      setList(prev => prev.map(i => i.id === id ? { ...i, status: "confirmed" } : i));
    }
  }

  // 취소 (화면에서 사라짐)
  async function cancelReservation(id: string) {
    if (!confirm("정말 취소하시겠습니까?")) return;

    const res = await fetch("/api/reservations/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if ((await res.json()).ok) {
      alert("취소 완료!");
      setList(prev => prev.map(i => i.id === id ? { ...i, status: "cancelled" } : i));
    }
  }

  if (!authenticated) {
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#111", color: "#fff" }}>
        <h1 style={{ fontSize: "42px", marginBottom: "50px" }}>관리자 로그인</h1>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && checkPassword()} style={{ padding: "20px", fontSize: "24px", width: "340px", borderRadius: "12px", border: "none", textAlign: "center", marginBottom: "20px" }} placeholder="비밀번호" />
        <button onClick={checkPassword} style={{ padding: "16px 48px", fontSize: "20px", background: "#fff", color: "#000", border: "none", borderRadius: "12px" }}>로그인</button>
      </div>
    );
  }

  // 완벽한 검색 로직 (이름은 대소문자 구분 없이, 부분 일치, 전화번호 뒷4자리도 OK)
  const filteredList = list.filter(item => {
    const q = searchQuery.trim().toLowerCase();

    if (q === "") {
      // 검색 없으면 기간 내 + 취소 숨김
      const inRange = new Date(item.start) <= new Date(endDate) && new Date(item.end) >= new Date(startDate);
      return inRange && item.status !== "cancelled";
    }

    // 검색 있으면 과거 모든 예약 다 보여줌
    const matchesName = item.name.toLowerCase().includes(q);
    const cleanedPhone = item.phone.replace(/[^0-9]/g, "");
    const matchesPhone = cleanedPhone.includes(q.replace(/[^0-9]/g, "")) || cleanedPhone.endsWith(q.replace(/[^0-9]/g, "")); // 뒷자리 검색 강화

    return matchesName || matchesPhone;
  });

  return (
    <div style={{ padding: 40, fontFamily: "system-ui, sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>관리자 예약 목록</h1>

      {/* 검색 + 기간 선택 */}
      <div style={{ maxWidth: 1200, margin: "0 auto 30px", background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>시작일 (과거 아무리 오래전도 OK)</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: 12, width: "100%", borderRadius: 8, border: "1px solid #ddd" }} />
          </div>
          <div>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>종료일</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: 12, width: "100%", borderRadius: 8, border: "1px solid #ddd" }} />
          </div>
          <div>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>이름·전화번호 검색 (재방문 확인)</label>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="이름 일부 또는 전화번호 뒷4자리" style={{ padding: 12, width: "100%", borderRadius: 8, border: "1px solid #ddd" }} />
          </div>
        </div>
        <p style={{ textAlign: "center", color: "#444", fontSize: 16 }}>
          총 {filteredList.length}건 표시 중
          {searchQuery && " (검색 결과: 과거 예약 포함)"}
        </p>
      </div>

      <button onClick={() => { localStorage.removeItem("admin-auth"); setAuthenticated(false); }} style={{ position: "absolute", top: 20, right: 20, padding: "10px 20px", background: "#333", color: "#fff", border: "none", borderRadius: 8 }}>
        로그아웃
      </button>

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
            <tr key={item.id} style={{ borderBottom: "1px solid #eee", textAlign: "center", opacity: item.status === "cancelled" ? 0.5 : 1 }}>
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
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontWeight: "bold",
                  fontSize: 14,
                  background: item.status === "confirmed" ? "#d4edda" : item.status === "cancelled" ? "#f8d7da" : "#fff3cd",
                  color: item.status === "confirmed" ? "#155724" : item.status === "cancelled" ? "#721c24" : "#856404",
                }}>
                  {item.status === "confirmed" ? "확정" : item.status === "cancelled" ? "취소" : "대기중"}
                </span>
              </td>
              <td style={{ padding: 16 }}>
                {item.status === "pending" && (
                  <button onClick={() => confirmReservation(item.id)} style={{ marginRight: 8, padding: "8px 16px", background: "#28a745", color: "#fff", border: "none", borderRadius: 6 }}>
                    확정
                  </button>
                )}
                {item.status !== "cancelled" && (
                  <button onClick={() => cancelReservation(item.id)} style={{ padding: "8px 16px", background: "#dc3545", color: "#fff", border: "none", borderRadius: 6 }}>
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