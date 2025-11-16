export default function Home() {
  return (
    <div>
      {/* 메인 히어로 이미지 */}
      <div
        style={{
          width: "100%",
          height: "75vh",
          backgroundImage: "url('/photo/photo1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* 소개 섹션 */}
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>전형적 서민 숙소</h1>
        <p style={{ fontSize: "18px", color: "#666", marginTop: "12px" }}>
          음악듣고 맘껏 불멍하며 그냥 푹쉬기<br />
          약간의 불편함은 추억을 남기고 힐링을 줍니다
        </p>

        <a
          href="/reservations"
          style={{
            display: "inline-block",
            marginTop: "30px",
            padding: "14px 28px",
            background: "#222",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "18px",
          }}
        >
          예약 페이지 바로가기 →
        </a>
      </div>

      {/* 사진 갤러리 */}
      <div style={{ display: "flex", gap: "16px", padding: "20px", justifyContent: "center" }}>
        <img src="/photo/photo2.jpg" width="300" height="200" style={{ objectFit: "cover", borderRadius: 10 }} />
        <img src="/photo/photo3.jpg" width="300" height="200" style={{ objectFit: "cover", borderRadius: 10 }} />
      </div>
    </div>
  );
}

