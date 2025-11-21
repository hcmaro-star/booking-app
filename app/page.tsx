// app/page.tsx - 메인 페이지 (3장 사진 + 2버튼)
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#fff", minHeight: "100vh" }}>
      {/* 3장 사진 */}
      <div style={{ padding: "20px" }}>
        <Image
          src="/main1.jpg"
          width={1200}
          height={800}
          alt="Veentee 1"
          style={{ width: "100%", height: "auto", borderRadius: 20, marginBottom: 20 }}
          priority
        />
        <Image
          src="/main2.jpg"
          width={1200}
          height={800}
          alt="Veentee 2"
          style={{ width: "100%", height: "auto", borderRadius: 20, marginBottom: 20 }}
          priority
        />
        <Image
          src="/main3.jpg"
          width={1200}
          height={800}
          alt="Veentee 3"
          style={{ width: "100%", height: "auto", borderRadius: 20 }}
          priority
        />
      </div>

      {/* 버튼 2개 */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, padding: "80px 20px" }}>
        <Link href="/reservations">
          <button style={{ width: "90%", maxWidth: 400, padding: "24px", fontSize: "28px", background: "#111", color: "#fff", border: "none", borderRadius: 16 }}>
            예약 남기기
          </button>
        </Link>
        <Link href="/photos">
          <button style={{ width: "90%", maxWidth: 400, padding: "24px", fontSize: "28px", background: "#333", color: "#fff", border: "none", borderRadius: 16 }}>
            추가 사진 보기
          </button>
        </Link>
      </div>
    </div>
  );
}