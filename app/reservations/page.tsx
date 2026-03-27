"use client";

import React from "react";

export default function ReservationsPage() {
  // 실제 숙소 사진 URL로 교체하시면 됩니다.
  const photos = [
    { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000", desc: "포근한 메인 침실" },
    { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000", desc: "햇살이 잘 드는 거실" },
    { url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1000", desc: "모던한 주방 공간" },
    { url: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=1000", desc: "청결한 욕실" },
  ];

  return (
    <div style={{ padding: "60px 20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "system-ui, sans-serif", color: "#333" }}>
      
      {/* 상단 타이틀 */}
      <header style={{ textAlign: "center", marginBottom: "80px" }}>
        <h1 style={{ fontSize: "56px", fontWeight: "bold", marginBottom: "16px", letterSpacing: "-1.5px" }}>Veentee 빈티</h1>
        <div style={{ width: "60px", height: "4px", background: "#111", margin: "0 auto 20px" }}></div>
        <p style={{ fontSize: "22px", color: "#666", fontWeight: "300" }}>쉼과 영감이 공존하는 우리만의 공간</p>
      </header>

      {/* 사진 갤러리 섹션 */}
      <section style={{ marginBottom: "100px" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: "30px" 
        }}>
          {photos.map((photo, index) => (
            <div key={index} style={{ 
              borderRadius: "12px", 
              overflow: "hidden", 
              boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
              background: "#fff"
            }}>
              <img 
                src={photo.url} 
                alt={photo.desc} 
                style={{ width: "100%", height: "350px", objectFit: "cover", display: "block" }} 
              />
              <div style={{ padding: "24px", textAlign: "center", fontWeight: "500", fontSize: "18px", color: "#555" }}>
                {photo.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 오직 이메일만 남긴 안내 섹션 */}
      <section style={{ 
        background: "#f4f4f4", 
        padding: "80px 40px", 
        borderRadius: "20px", 
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "32px", marginBottom: "20px", fontWeight: "bold" }}>Inquiry</h2>
        <p style={{ fontSize: "20px", marginBottom: "40px", color: "#666", lineHeight: "1.7" }}>
          숙소 이용 및 예약 관련 문의는 이메일을 통해 접수받고 있습니다.<br/>
          성함과 연락처, 원하시는 일정을 남겨주시면 회신 드리겠습니다.
        </p>

        <div style={{ 
          display: "inline-block",
          padding: "24px 50px", 
          background: "#fff", 
          border: "1px solid #ddd",
          borderRadius: "50px",
          fontSize: "24px",
          fontWeight: "bold",
          boxShadow: "0 10px 20px rgba(0,0,0,0.03)"
        }}>
          📧 hcmaro@gmail.com
        </div>

        <button 
          onClick={() => {
            navigator.clipboard.writeText("hcmaro@gmail.com");
            alert("이메일 주소가 복사되었습니다.");
          }}
          style={{
            display: "block",
            margin: "20px auto 0",
            background: "none",
            border: "none",
            color: "#0070f3",
            cursor: "pointer",
            fontSize: "16px",
            textDecoration: "underline"
          }}
        >
          주소 복사하기
        </button>
      </section>

      <footer style={{ textAlign: "center", marginTop: "100px", color: "#bbb", fontSize: "14px", letterSpacing: "1px" }}>
        © 2026 VEENTEE. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}