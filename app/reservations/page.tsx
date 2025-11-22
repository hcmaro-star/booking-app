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

  // 스타일 정의
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

  // 확정 예약만
  const confirmed = list.filter((item) => item.status === "confirmed");

  // 날짜가 예약된 범위에 있는지 확인 (퇴실일 제외)
  const isDateBlocked = (dateStr: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return confirmed.some((res) => {
      const resStart = new Date(res.start);
      const resEnd = new Date(res.end);
      return isWithinInterval(date, { start: resStart, end: addDays(resEnd, -1) });
    });
  };

  // 중복 체크
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

  // 예약 목록 불러오기
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

  // 예약 제출
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
      const address = "TRzigoYVjcNA9V77LqcvzttLx7gSeFimsT";
      navigator.clipboard.writeText(address);

      alert(
        `예약이 접수되었습니다!\n\n` +
        `호스트가 곧 연락드릴게요. 정말 감사합니다\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `가상화폐 입금 안내 (10% 할인)\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `코인: USDT\n` +
        `네트워크: Tron (TRC20)\n` +
        `입금주소: ${address}\n\n` +
        `주소가 자동으로 복사되었습니다!\n` +
        `Bybit → 출금 → 붙여넣기만 하세요\n\n` +
        `현금 입금은 호스트가 개별 안내드립니다`
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

  // 마스킹 함수
  const maskName = (n: string) => (n.length > 2 ? n[0] + "*".repeat(n.length - 2) + n.slice(-1) : n[0] + "*");
  const maskPhone = (p: string) => p.replace(/(\d{3})\d+(\d{4})/, "$1****$2");

  const walletAddress = "TRzigoYVjcNA9V77LqcvzttLx7gSeFimsT";

  return (
    <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>

      {/* 가상화폐 입금 안내 박스 (항상 상단 고정) */}
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
          USDT 입금 시 10% 자동 할인!
        </h3>
        <p style={{ fontSize: "20px", margin: "15px 0", opacity: 0.9 }}>
          네트워크: <strong style={{ color: "#00d4ff" }}>Tron (TRC20)</strong>
        </p>
        <div style={{
          background: "#222",
          padding: "20px",
          borderRadius: 16,
          margin: "25px 0",
          fontSize: "24px",
          fontFamily: "monospace",
          wordBreak: "break-all" as const,
          letterSpacing: "1px"
        }}>
          {walletAddress}
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(walletAddress);
            alert("입금주소가 복사되었습니다! Bybit → 출금 → 붙여넣기 하세요");
          }}
          style={{
            padding: "16px 40px",
            fontSize: "22px",
            background: "#00d4ff",
            color: "#000",
            border: "none",
            borderRadius: 14,
            cursor: "pointer",
            fontWeight: "bold",
            marginTop: "10px"
          }}
        >
          주소 복사하기
        </button>
        <p style={{ marginTop: "25px", fontSize: "17px", opacity: 0.85, lineHeight: "1.6" }}>
          정확한 금액 입금 시 자동 확인 후 확정 연락드립니다<br/>
          현금 입금은 호스트가 개별 안내드릴게요
        </p>
      </div>

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