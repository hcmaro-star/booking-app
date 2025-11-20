// app/reviews/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Reviews() {
  const reviews = [
    "/review1.jpg", "/review2.jpg", "/review3.jpg", "/review4.jpg", "/review5.jpg",
    "/review6.jpg", "/review7.jpg", "/review8.jpg", "/review9.jpg", "/review10.jpg"
  ];

  return (
    <div style={{ padding: "80px 20px", background: "#fff", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", fontSize: "44px", marginBottom: 60 }}>게스트 후기</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30, maxWidth: 1200, margin: "0 auto" }}>
        {reviews.map((src, i) => (
          <Image key={i} src={src} width={600} height={800} alt={`리뷰 ${i+1}`} style={{ borderRadius: 16 }} />
        ))}
      </div>

      <div style={{ marginTop: 80, textAlign: "center" }}>
        <Link href="/reservations">
          <button style={{ width: "90%", maxWidth: 400, padding: "24px", fontSize: "26px", background: "#111", color: "#fff", border: "none", borderRadius: 16 }}>
            예약 남기기
          </button>
        </Link>
      </div>
    </div>
  );
}