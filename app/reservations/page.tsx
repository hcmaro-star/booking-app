"use client";

import { useEffect, useState } from "react";
import { format, addDays, isWithinInterval } from "date-fns";

export default function ReservationsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [list, setList] = useState<any[]>([]);

  const bigInput = {
    padding: "18px",
    fontSize: "20px",
    width: "100%",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxSizing: "border-box" as const,
  };

  const bigLabel = {
    fontSize: "24px",
    fontWeight: "bold" as const,
    marginBottom: "8px",
    display: "block" as const,
  };

  const confirmed = list.filter((item) => item.status === "confirmed");

  const isDateBlocked = (dateStr: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return confirmed.some((res) => {
      const resStart = new Date(res.start);
      const resEnd = new Date(res.end);
      return isWithinInterval(date, { start: resStart, end: addDays(resEnd, -1) });
    });
  };

  const hasOverlap = () => {
    if (!start || !end) return false;
    const newStart = new Date(start);
    const newEnd = new Date(end);
    return confirmed.some((res) => {
      const resStart = new Date(res.start);
      const resEnd = new Date(res.end);
      return newStart < resEnd && newEnd > resStart;
    });
  };

  const loadReservations = async () => {
    try {
      const res = await fetch("/api/reservations");
      const data = await res.json();
      if (Array.isArray(data)) setList(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const submit = async () => {
    if (!name || !phone || !start || !end) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }

    if (hasOverlap()) {
      alert("선택하신 기간에 이미 확정된 예약이 있습니다.\n\n가능한 퇴실 날짜를 다시 확인해 주세요.");
      return;
    }

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ name, phone, guests, start, end }),
    });

    const result = await res.json();
    if (result.ok) {
      alert(
        `예약이 접수되었습니다!\n\n` +
        `호스트가 곧 연락드릴게요. 정말 감사합니다\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `입금 안내\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `아래 두 가지 방법 중 편한 것으로 입금해 주세요\n\n` +
        `1. 가상화폐 (USDT)\n` +
        `   거래소: Bybit\n` +
        `   네트워크: Tron (TRC20)\n` +
        `   주소: TRzigoYVjcNA9V77LqcvzttLx7gSeFimsT\n\n` +
        `2. PayPal (가장 쉬움)\n` +
        `   이메일: hcmaro@gmail.com\n` +
        `   전화번호: +821089941584\n\n` +
        `입금 완료 후 호스트가 바로 확인해 드립니다\n` +
        `현금 입금은 개별 안내드릴게요`
      );

      setName("");
      setPhone("");
      setGuests(1);
      setStart("");
      setEnd("");
      loadReservations();
    } else {
      alert(`예약 실패: ${result.error || "알 수 없는 오류"}`);
    }
  };

  const maskName = (n: string) => (n.length > 2 ? n[0] + "*".repeat(n.length - 2) + n.slice(-1) : n[0] + "*");
  const maskPhone = (p: string) => p.replace(/(\d{3})\d+(\d{4})/, "$1****$2");

  return (
    <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>

      {/* 입금 안내 박스 - 할인 문구 삭제, PayPal 추가 */}
      <div style={{
        background: "#111",
        color: "#fff",
        padding: "40px 30px",
        borderRadius: 20,
        marginBottom: "50px",
        textAlign: "center" as const,
        boxShadow: "0 15px 40px rgba(0,0,0,0.4)"
      }}>
        <h3 style={{ fontSize: "32px", margin: "0 0 25px 0", fontWeight: "bold" }}>
          입금 안내
        </h3>
        <p style={{ fontSize: "19px", margin: "20px 0", opacity: 0.9 }}>
          아래 두 가지 방법 중 편하신 것으로 입금해 주세요
        </p>

        {/* USDT */}
        <p style={{ fontSize: "20px", margin: "20px 0 10px" }}>
          가상화폐 (USDT)
        </p>
        <p style={{ fontSize: "19px", margin: "8px 0", opacity: 0.9 }}>
          거래소: <strong style={{ color: "#00d4ff" }}>Bybit</strong>
        </p>
        <p style={{ fontSize: "19px", margin: "8px 0", opacity: 0.9 }}>
          네트워크: <strong style={{ color: "#00d4ff" }}>Tron (TRC20)</strong>
        </p>
        <div style={{
          background: "#222", padding: "20px", borderRadius: 16, margin: "20px 0",
          fontSize: "22px", fontFamily: "monospace", wordBreak: "break-all" as const
        }}>
          TRzigoYVjcNA9V77LqcvzttLx7gSeFimsT
        </div>

        {/* PayPal */}
        <p style={{ fontSize: "20px", margin: "30px 0 10px" }}>
          PayPal (가장 쉬움)
        </p>
        <div style={{
          background: "#222", padding: "20px", borderRadius: 16, margin: "15px 0",
          fontSize: "22px", fontFamily: "monospace"
        }}>
          hcmaro@gmail.com
        </div>
        <div style={{
          background: "#222", padding: "20px", borderRadius: 16, margin: "15px 0",
          fontSize: "22px", fontFamily: "monospace"
        }}>
          +821089941584
        </div>

        <div style={{ display: "flex", gap: 15, justifyContent: "center", marginTop: 25 }}>
          <button onClick={() => { navigator.clipboard.writeText("TRzigoYVjcNA9V77LqcvzttLx7gSeFimsT"); alert("USDT 주소 복사 완료!"); }}
            style={{ padding: "14px 24px", background: "#00d4ff", color: "#000", border: "none", borderRadius: 12, fontWeight: "bold" }}>
            USDT 주소 복사
          </button>
          <button onClick={() => { navigator.clipboard.writeText("hcmaro@gmail.com"); alert("PayPal 이메일 복사 완료!"); }}
            style={{ padding: "14px 24px", background: "#ffc107", color: "#000", border: "none", borderRadius: 12, fontWeight: "bold" }}>
            PayPal 이메일 복사
          </button>
          <button onClick={() => { navigator.clipboard.writeText("+821089941584"); alert("PayPal 전화번호 복사 완료!"); }}
            style={{ padding: "14px 24px", background: "#28a745", color: "#fff", border: "none", borderRadius: 12, fontWeight: "bold" }}>
            전화번호 복사
          </button>
        </div>

        <p style={{ marginTop: "25px", fontSize: "17px", opacity: 0.85, lineHeight: "1.6" }}>
          입금 완료 후 호스트가 바로 확인 후 확정 연락드립니다<br/>
          현금 입금은 호스트가 개별 안내드릴게요
        </p>
      </div>

      {/* 나머지 예약 폼은 그대로 */}
      <h1 style={{ fontSize: "42px", fontWeight: "bold", textAlign: "center", margin: "40px 0" }}>
        예약하기
      </h1>

      <label style={bigLabel}>이름</label>
      <input style={bigInput} placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />

      <label style={bigLabel}>전화번호</label>
      <input style={bigInput} placeholder="01012345678" value={phone} onChange={(e) => setPhone(e.target.value)} />

      <label style={bigLabel}>인원 수</label>
      <input style={bigInput} type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />

      <label style={bigLabel}>입실 날짜</label>
      <input
        type="date"
        style={{
          ...bigInput,
          backgroundColor: isDateBlocked(start) ? "#fee2e2" : "#ffffff",
        }}
        value={start}
        min={format(new Date(), "yyyy-MM-dd")}
        onChange={(e) => setStart(e.target.value)}
      />

      <label style={bigLabel}>퇴실 날짜</label>
      <input
        type="date"
        style={{
          ...bigInput,
          backgroundColor: isDateBlocked(end) ? "#fee2e2" : "#ffffff",
        }}
        value={end}
        min={start ? format(addDays(new Date(start), 1), "yyyy-MM-dd") : ""}
        onChange={(e) => setEnd(e.target.value)}
      />

      <button
        onClick={submit}
        style={{
          padding: "24px",
          fontSize: "28px",
          background: "#111",
          color: "#fff",
          width: "100%",
          borderRadius: "16px",
          marginTop: "20px",
          fontWeight: "bold" as const,
        }}
      >
        예약하기
      </button>

      {/* 예약 현황은 기존 그대로 */}
      <h2 style={{ marginTop: "80px", fontSize: "36px", fontWeight: "bold", textAlign: "center" }}>
        예약 현황
      </h2>

      {confirmed.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "22px", marginTop: "20px", color: "#666" }}>
          현재 예약이 없습니다.
        </p>
      ) : (
        confirmed.map((v, i) => (
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
            <div>이름: {maskName(v.name)}</div>
            <div>전화번호: {maskPhone(v.phone)}</div>
            <div>인원: {v.guests}</div>
            <div>날짜: {v.start} ~ {v.end}</div>
          </div>
        ))
      )}
    </div>
  );
}