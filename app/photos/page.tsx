// app/photos/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Photos() {
  const photos = Array.from({ length: 18 }, (_, i) => `/photo${i + 1}.jpg`);

  return (
    <div style={{ padding: "60px 20px", background: "#f9f9f9", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", fontSize: "44px", marginBottom: 60, fontWeight: "bold" }}>추가 사진</h1>

      {/* 한 행에 2장씩, 선명도 최고 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "40px 30px", maxWidth: 1400, margin: "0 auto" }}>
        {photos.map((src, i) => (
          <Image
            key={i}
            src={src}
            width={1200}
            height={900}
            alt={`사진 ${i + 1}`}
            style={{ width: "100%", height: "auto", borderRadius: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
          />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, marginTop: 100 }}>
        <Link href="/reservations">
          <button style={{ width: 360, padding: "24px", fontSize: "26px", background: "#111", color: "#fff", border: "none", borderRadius: 16 }}>
            예약 남기기
          </button>
        </Link>
        <Link href="/intro">
          <button style={{ width: 360, padding: "24px", fontSize: "26px", background: "#333", color: "#fff", border: "none", borderRadius: 16 }}>
            숙소 소개 보기
          </button>
        </Link>
      </div>
    </div>
  );
}