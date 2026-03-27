"use client";

import React from "react";

export default function IntroPage() {
  return (
    <div style={{ padding: "80px 20px", maxWidth: "800px", margin: "0 auto", fontFamily: "system-ui, sans-serif", color: "#111", lineHeight: "1.6" }}>
      <header style={{ textAlign: "center", marginBottom: "100px" }}>
        <h1 style={{ fontSize: "72px", fontWeight: "bold", marginBottom: "20px", letterSpacing: "-3px" }}>Veentee</h1>
        <div style={{ width: "40px", height: "2px", background: "#111", margin: "0 auto 30px" }}></div>
        <p style={{ fontSize: "24px", color: "#444", fontWeight: "300" }}>쉼과 영감이 공존하는 우리만의 공간</p>
      </header>
      <section style={{ marginBottom: "120px", textAlign: "center" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "40px" }}>About Space</h2>
        <p style={{ fontSize: "19px", color: "#555", marginBottom: "20px" }}>빈티는 바쁜 일상에서 벗어나 온전한 휴식을 취할 수 있도록 설계된 공간입니다.</p>
        <p style={{ fontSize: "19px", color: "#555" }}>자연스러운 질감과 따뜻한 조명 아래에서 당신만의 시간을 가져보세요.</p>
      </section>
      <footer style={{ marginTop: "150px", paddingTop: "60px", borderTop: "1px solid #eee", textAlign: "center" }}>
        <h3 style={{ fontSize: "24px", marginBottom: "20px", fontWeight: "bold" }}>Contact</h3>
        <p style={{ fontSize: "18px", color: "#666", marginBottom: "30px" }}>모든 문의사항은 이메일로 보내주시면 확인 후 답변드리겠습니다.</p>
        <div style={{ display: "inline-block", padding: "20px 40px", background: "#111", color: "#fff", borderRadius: "50px", fontSize: "22px", fontWeight: "bold" }}>
          📧 hcmaro@gmail.com
        </div>
        <button onClick={() => { navigator.clipboard.writeText("hcmaro@gmail.com"); alert("이메일 주소가 복사되었습니다."); }} style={{ display: "block", margin: "20px auto 0", background: "none", border: "none", color: "#0070f3", cursor: "pointer", fontSize: "15px", textDecoration: "underline" }}>
          주소 복사하기
        </button>
        <p style={{ marginTop: "80px", color: "#ccc", fontSize: "13px", letterSpacing: "2px" }}>© 2026 VEENTEE. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}