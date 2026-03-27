import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#fff", padding: "40px 10px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto 40px" }}>
        <Image src="/main4.jpg" width={1200} height={800} alt="Veentee CI" style={{ width: "100%", height: "auto", borderRadius: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }} priority />
      </div>
      <div style={{ maxWidth: 800, margin: "0 auto 40px" }}>
        <Image src="/main0.jpg" width={1200} height={800} alt="Veentee 메인0" style={{ width: "100%", height: "auto", borderRadius: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }} priority />
      </div>
      <div style={{ maxWidth: 800, margin: "0 auto 40px" }}>
        <Image src="/main1.jpg" width={1200} height={800} alt="Veentee 메인1" style={{ width: "100%", height: "auto", borderRadius: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", maxWidth: 1200, margin: "0 auto 80px" }}>
        <Image src="/main2.jpg" width={800} height={600} alt="Veentee 2" style={{ width: "100%", height: "auto", borderRadius: 20, boxShadow: "0 8px 25px rgba(0,0,0,0.12)" }} />
        <Image src="/main3.jpg" width={800} height={600} alt="Veentee 3" style={{ width: "100%", height: "auto", borderRadius: 20, boxShadow: "0 8px 25px rgba(0,0,0,0.12)" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, marginBottom: "60px" }}>
        <Link href="/intro">
          <button style={{ width: 360, padding: "24px", fontSize: "28px", background: "#111", color: "#fff", border: "none", borderRadius: 16, cursor: "pointer" }}>
            숙소 소개 및 문의
          </button>
        </Link>
        <Link href="/photos">
          <button style={{ width: 360, padding: "24px", fontSize: "28px", background: "#444", color: "#fff", border: "none", borderRadius: 16, cursor: "pointer" }}>
            추가 사진 보기
          </button>
        </Link>
      </div>
      <footer style={{ textAlign: "center", color: "#ccc", fontSize: "14px" }}>© 2026 VEENTEE. ALL RIGHTS RESERVED.</footer>
    </div>
  );
}