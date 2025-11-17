export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      
      {/* 최상단 큰 메인 사진 */}
      <img
        src="/photo/photo1.gif"
        alt="main photo"
        style={{
          width: "100%",
          maxWidth: "1200px",
          borderRadius: "12px",
          display: "block",
          margin: "0 auto",
        }}
      />

      {/* 아래 2개의 사진 */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <img
          src="/photo/photo2.jpg"
          width="300"
          height="200"
          style={{
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />

        <img
          src="/photo/photo3.jpg"
          width="300"
          height="200"
          style={{
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      </div>

      {/* 소개 텍스트 */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "bold" }}>
          60년전의 전형적 서민 주택
        </h2>
        <p style={{ fontSize: "18px", color: "#444", marginTop: "12px" }}>
          음악듣고 맘껏 불멍하며 그냥 푹 쉬기 <br />
          약간의 불편함은 추억을 남기고 힐링을 줍니다
        </p>
      </div>

      <a
        href="/reservations"
        style={{
          display: "inline-block",
          marginTop: "30px",
          padding: "14px 28px",
          borderRadius: "8px",
          background: "#222",
          color: "#fff",
          textDecoration: "none",
          fontSize: "18px",
        }}
      >
        예약 페이지 바로가기 →
      </a>
    </div>
  );
}
