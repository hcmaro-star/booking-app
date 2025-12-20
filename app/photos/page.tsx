// app/photos/page.tsx - 실제 있는 파일만 자동 표시 (공란 0개!)
import Image from "next/image";
import Link from "next/link";

// 실제 public에 있는 파일 이름만 나열 (없는 건 빼세요!)
const existingPhotos = [
  "/photo1.jpg",
  "/photo2.jpg",
  "/photo3.jpg",
  "/photo4.jpg",   // 확장자 제대로 된 거
  "/photo5.jpg",
  "/photo6.jpg",
  "/photo7.jpg",
  "/photo8.jpg",
  "/photo9.jpg",
  "/photo10.jpg",
  "/photo11.jpg",
  "/photo12.jpg",
  "/photo13.jpg",
  "/photo14.jpg",
  "/photo15.jpg",
  "/photo16.jpg",
  "/photo17.jpg",
  "/photo18.jpg",
  // photo19.jpg 없으면 여기까지! (공란 안 생김)
];

export default function Photos() {
  return (
    <div style={{ padding: "60px 20px", background: "#f9f9f9", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", fontSize: "44px", marginBottom: 60, fontWeight: "bold" }}>추가 사진</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "40px 30px", maxWidth: 1400, margin: "0 auto" }}>
        {existingPhotos.map((src, i) => (
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