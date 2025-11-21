// app/reviews/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Reviews() {
  const reviews = Array.from({ length: 20 }, (_, i) => `/review${i + 1}.jpg`);

  return (
    <div style={{ padding: "80px 20px", background: "#fff", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", fontSize: "44px", marginBottom: 60 }}>게스트 후기</h1>

      {/* 한 행에 2장씩, 작고 선명하게 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "40px 30px", maxWidth: 1200, margin: "0 auto" }}>
        {reviews.map((src, i) => (
          <Image
            key={i}
            src={src}
            width={800}
            height={1000}
            alt={`리뷰 ${i + 1}`}
            style={{ width: "100%", height: "auto", borderRadius: 20, boxShadow: "0 8px 25px rgba(0,0,0,0.12)" }}
          />
        ))}
      </div>

      <div style={{ marginTop: 100, textAlign: "center" }}>
        <Link href="/reservations">
          <button style={{ width: 360, padding: "24px", fontSize: "26px", background: "#111", color: "#fff", border: "none", borderRadius: 16 }}>
            예약 남기기
          </button>
        </Link>
      </div>
    </div>
  );
}