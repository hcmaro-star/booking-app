// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#fff", padding: "20px 10px" }}>
      {/* main1 - 절반 크기, 선명하게 */}
      <div style={{ maxWidth: 800, margin: "0 auto 40px" }}>
        <Image
          src="/main1.jpg"
          width={1200}
          height={800}
          alt="Veentee 메인"
          style={{ width: "100%", height: "auto", borderRadius: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
          priority
        />
      </div>

      {/* main2, main3 - 병렬 배치, 각각 main1의 약 45%, 간격 있음 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", maxWidth: 1200, margin: "0 auto 80px" }}>
        <Image
          src="/main2.jpg"
          width={800}
          height={600}
          alt="Veentee 2"
          style={{ width: "100%", height: "auto", borderRadius: 20, boxShadow: "0 8px 25px rgba(0,0,0,0.12)" }}
          priority
        />
        <Image
          src="/main3.jpg"
          width={800}
          height={600}
          alt="Veentee 3"
          style={{ width: "100%", height: "auto", borderRadius: 20, boxShadow: "0 8px 25px rgba(0,0,0,0.12)" }}
          priority
        />
      </div>

      {/* 버튼 2개 */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <Link href="/reservations">
          <button style={{ width: 360, padding: "24px", fontSize: "28px", background: "#111", color: "#fff", border: "none", borderRadius: 16 }}>
            예약 남기기
          </button>
        </Link>
        <Link href="/photos">
          <button style={{ width: 360, padding: "24px", fontSize: "28px", background: "#333", color: "#fff", border: "none", borderRadius: 16 }}>
            추가 사진 보기
          </button>
        </Link>
      </div>
    </div>
  );
}