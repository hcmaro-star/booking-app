// app/reviews/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Reviews() {
  const reviews = Array.from({ length: 20 }, (_, i) => `/review${i + 1}.jpg`);

  return (
    <div style={{ padding: "80px 20px", background: "#fff", minHeight: "100vh", textAlign: "center" }}>
      <h1 style={{ fontSize: "44px", marginBottom: 60, fontWeight: "bold" }}>게스트 후기</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30, maxWidth: 1200, margin: "0 auto" }}>
        {reviews.map((src, i) => (
          <Image key={i} src={src} width={600} height={800} alt={`리뷰 ${i + 1}`} style={{ borderRadius: 16, boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }} />
        ))}
      </div>

      <div style={{ marginTop: 80 }}>
        <Link href="/reservations">
          <button style={{ width: "340px", padding: "22px", fontSize: "26px", background: "#111", color: "#fff", border: "none", borderRadius: 16 }}>
            예약 남기기
          </button>
        </Link>
      </div>
    </div>
  );
}