// app/photos/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Photos() {
  const photos = Array.from({ length: 18 }, (_, i) => `/photo${i + 1}.jpg`);

  return (
    <div style={{ padding: "40px 20px", background: "#f9f9f9", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", fontSize: "42px", marginBottom: 50 }}>추가 사진</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20, maxWidth: 1400, margin: "0 auto" }}>
        {photos.map((src, i) => (
          <Image key={i} src={src} width={800} height={600} alt={`사진 ${i+1}`} style={{ borderRadius: 16, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, marginTop: 80 }}>
        <Link href="/reservations">
          <button style={{ width: "90%", maxWidth: 400, padding: "24px", fontSize: "26px", background: "#111", color: "#fff", border: "none", borderRadius: 16 }}>
            예약 남기기
          </button>
        </Link>
        <Link href="/intro">
          <button style={{ width: "90%", maxWidth: 400, padding: "24px", fontSize: "26px", background: "#333", color: "#fff", border: "none", borderRadius: 16 }}>
            숙소 소개 보기
          </button>
        </Link>
      </div>
    </div>
  );
}