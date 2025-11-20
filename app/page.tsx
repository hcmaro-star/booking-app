// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* 메인 3장 사진 */}
      <div style={{ padding: "20px 10px", background: "#fafafa" }}>
        <Image src="/main1.jpg" width={1200} height={800} alt="메인1" style={{ width: "100%", height: "auto", borderRadius: 20, marginBottom: 20 }} priority />
        <Image src="/main2.jpg" width={1200} height={800} alt="메인2" style={{ width: "100%", height: "auto", borderRadius: 20, marginBottom: 20 }} priority />
        <Image src="/main3.jpg" width={1200} height={800} alt="메인3" style={{ width: "100%", height: "auto", borderRadius: 20 }} priority />
      </div>

      {/* 두 개 버튼 */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, padding: "60px 20px", background: "#fff" }}>
        <Link href="/reservations">
          <button style={{ width: "320px", padding: "22px", fontSize: "28px", background: "#111", color: "#fff", border: "none", borderRadius: 16, cursor: "pointer" }}>
            예약 남기기
          </button>
        </Link>
        <Link href="/photos">
          <button style={{ width: "320px", padding: "22px", fontSize: "28px", background: "#333", color: "#fff", border: "none", borderRadius: 16, cursor: "pointer" }}>
            추가 사진 보기
          </button>
        </Link>
      </div>
    </div>
  );
}