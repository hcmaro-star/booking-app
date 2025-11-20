import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.7" }}>

      {/* 메인 히어로 (그대로) */}
      <section style={{ position: "relative", height: "100vh", minHeight: "650px" }}>
        <Image src="/main.jpg" alt="Veentee 전경" fill style={{ objectFit: "cover" }} priority />
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", textAlign: "center", padding: 20
        }}>
          <h1 style={{ fontSize: "58px", fontWeight: "bold", marginBottom: 20, textShadow: "3px 3px 15px rgba(0,0,0,0.8)" }}>
            Veentee
          </h1>
          <p style={{ fontSize: "30px", marginBottom: 50, textShadow: "2px 2px 10px rgba(0,0,0,0.8)" }}>
            약간의 불편함은 추억을 남긴다
          </p>
          <Link href="/reservations">
            <button style={{ padding: "18px 50px", fontSize: "24px", background: "#fff", color: "#000", border: "none", borderRadius: 12, cursor: "pointer" }}>
              지금 예약하기 →
            </button>
          </Link>
        </div>
      </section>

      {/* 추가 사진 보기 버튼 */}
      <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff" }}>
        <Link href="#photos" style={{ fontSize: "20px", color: "#333", textDecoration: "none" }}>
          ▼ 추가 사진 보기 ▼
        </Link>
      </div>

      {/* 실내 사진 갤러리 */}
      <section id="photos" style={{ padding: "60px 20px", background: "#f8f9fa" }}>
        <h2 style={{ fontSize: "42px", textAlign: "center", marginBottom: 50 }}>실내 · 외부 사진</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 20, maxWidth: 1400, margin: "0 auto" }}>
          {["/photo1.jpg", "/photo2.jpg", "/photo3.jpg", "/photo4.jpg", "/photo5.jpg", "/photo6.jpg", "/photo7.jpg", "/photo8.jpg"].map((src, i) => (
            <Image key={i} src={src} width={800} height={600} alt={`Veentee 사진 ${i+1}`} style={{ borderRadius: 16, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/reservations">
            <button style={{ padding: "16px 40px", fontSize: "20px", background: "#222", color: "#fff", border: "none", borderRadius: 12 }}>
              사진 보고 예약하기 →
            </button>
          </Link>
        </div>
      </section>

      {/* 숙소 소개글 */}
      <section style={{ padding: "100px 20px", background: "#fff", textAlign: "center" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", fontSize: "19px", lineHeight: "2", color: "#333" }}>
          <h2 style={{ fontSize: "40px", marginBottom: 50 }}>숙소 소개</h2>
          <p style={{ whiteSpace: "pre-line" }}>
            저희 숙소 콘셉트는 '약간의 불편함은 추억을 남긴다'입니다.
            하루종일 햇빛을 받을 수 있는 툇마루, 비전문적이지만 친근하고 독특한 실내 인테리어, 마음껏 불놀이 할 수 있는 마당.
            정리되지 않은 듯 정리된, 불편할 것 같은데 너무 맘편한 숙소, 군청 100미터 반경에 있지만, 시골 외가에 온 것 같은 분위기. 풀, 텃밭, 벌레...
            정남향의 집이라 툇마루에선 따뜻한 햇살을, 방문 닫은 방안에선 밝지도 어둡지도 않은 부드러운 색감을 마주하게 됩니다. 
            실내조명 또한 과다하지 않고, 음악과 차 한잔에만 집중할 수 있도록 달았습니다.
            제 아지트는 준비마저 귀찮지만 쉼이 필요한, 여행을 아는 진정한 자유인의 쉼터입니다.
          </p>
          <div style={{ marginTop: 60 }}>
            <Link href="/reservations">
              <button style={{ padding: "16px 40px", fontSize: "20px", background: "#222", color: "#fff", border: "none", borderRadius: 12 }}>
                소개글 읽고 예약하기 →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 이용안내 & 요금 (고객님 최신 내용 100% 반영) */}
      <section style={{ padding: "80px 20px", background: "#f0f0f0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "40px", textAlign: "center", marginBottom: 50 }}>이용안내 및 요금</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, fontSize: "18px" }}>
            <div style={{ background: "#fff", padding: 30, borderRadius: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontSize: "24px", marginBottom: 20 }}>이용안내</h3>
              <ul style={{ textAlign: "left", lineHeight: "2.2" }}>
                <li>입실 15:00 ~ 퇴실 12:00</li>
                <li>반려동물 동반 불가</li>
                <li>불멍 가능</li>
                <li>주차 숙소 주변 어디나 가능</li>
              </ul>
            </div>
            <div style={{ background: "#fff", padding: 30, borderRadius: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontSize: "24px", marginBottom: 20 }}>요금 및 할인</h3>
              <ul style={{ textAlign: "left", lineHeight: "2.2" }}>
                <li>1인 기준 85,000원</li>
                <li>인원 추가 시 1인당 35,000원</li>
                <li>평일 · 주말 · 공휴일 요금 동일</li>
                <li>3박 이상 10% 할인</li>
                <li>5박 이상 20% 할인</li>
                <li>가상화폐(USDT, USDC) 결제 시 10% 할인</li>
                <li>할인 조건 중복 적용 가능</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 게스트 리뷰 섹션 */}
      <section id="reviews" style={{ padding: "80px 20px", background: "#fff", textAlign: "center" }}>
        <h2 style={{ fontSize: "42px", marginBottom: 50 }}>게스트 후기</h2>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30 }}>
          <Image src="/review1.jpg" width={600} height={800} alt="게스트 후기 1" style={{ borderRadius: 16 }} />
          <Image src="/review2.jpg" width={600} height={800} alt="게스트 후기 2" style={{ borderRadius: 16 }} />
          <Image src="/review3.jpg" width={600} height={800} alt="게스트 후기 3" style={{ borderRadius: 16 }} />
        </div>
        <div style={{ marginTop: 50 }}>
          <Link href="/reservations">
            <button style={{ padding: "16px 40px", fontSize: "20px", background: "#222", color: "#fff", border: "none", borderRadius: 12 }}>
              후기 보고 예약하기 →
            </button>
          </Link>
        </div>
      </section>

      {/* 하단 예약 버튼 */}
      <div style={{ padding: "60px 20px", textAlign: "center", background: "#111", color: "#fff" }}>
        <h3 style={{ fontSize: "32px", marginBottom: 30 }}>지금 바로 예약하세요</h3>
        <Link href="/reservations">
          <button style={{ padding: "18px 60px", fontSize: "24px", background: "#fff", color: "#000", border: "none", borderRadius: 12, cursor: "pointer" }}>
            예약하러 가기 →
          </button>
        </Link>
      </div>
    </div>
  );
}