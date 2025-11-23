// app/intro/page.tsx
import Link from "next/link";

export default function Intro() {
  return (
    <div style={{ padding: "80px 20px", maxWidth: 900, margin: "0 auto", textAlign: "center", lineHeight: "2.1", fontSize: "19px", color: "#333", background: "#fff", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "44px", marginBottom: 60 }}>숙소 소개</h1>
      <p style={{ whiteSpace: "pre-line", textAlign: "left" }}>
        저희 숙소 콘셉트는 '약간의 불편함은 추억을 남긴다'입니다.
        하루종일 햇빛을 받을 수 있는 툇마루, 비전문적이지만 친근하고 독특한 실내 인테리어, 
        마음껏 불놀이 할 수 있는 마당.
        정리되지 않은 듯 정리된, 불편할 것 같은데 너무 맘편한 숙소, 
        군청 100미터 반경에 있지만, 시골 외가에 온 것 같은 분위기. 풀, 텃밭, 벌레...
        정남향의 집이라 툇마루에선 따뜻한 햇살을, 
        방문 닫은 방안에선 밝지도 어둡지도 않은 부드러운 색감을 마주하게 됩니다.
        실내조명 또한 과다하지 않고, 음악과 차 한잔에만 집중할 수 있도록 달았습니다.
        제 아지트는 준비마저 귀찮지만 쉼이 필요한, 
        여행을 아는 진정한 자유인의 쉼터입니다.
      </p>

      {/* 이용안내 박스 - 고객님 최신 요청 정확 반영 */}
      <div style={{ margin: "80px 0", padding: 40, background: "#f0f0f0", borderRadius: 20 }}>
        <h2 style={{ fontSize: "32px", marginBottom: 30 }}>이용안내</h2>
        <ul style={{ textAlign: "left", lineHeight: "2.4", fontSize: "19px" }}>
          <li>입실 15:00 ~ 퇴실 12:00</li>
          <li>1인 기준 85,000원 (추가 인원 1인당 35,000원)</li>
          <li>평일 · 주말 · 공휴일 요금 동일</li>
          <li>3박 이상 10% 할인 · 5박 이상 20% 할인</li>
          <li>
            가상화폐(USDT), PayPal 결제, 현금 원화 입금(계좌 개별 전달)
          </li>
          <li>반려동물 동반 불가</li>
          <li>불멍 가능</li>
          <li>주차 숙소 주변 어디나 가능</li>
        </ul>
      </div>

      <div style={{ marginTop: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <Link href="/reservations">
          <button style={{ width: 360, padding: "24px", fontSize: "26px", background: "#111", color: "#fff", border: "none", borderRadius: 16 }}>
            예약 남기기
          </button>
        </Link>
        <Link href="/reviews">
          <button style={{ width: 360, padding: "24px", fontSize: "26px", background: "#333", color: "#fff", border: "none", borderRadius: 16 }}>
            게스트 리뷰 보기
          </button>
        </Link>
      </div>
    </div>
  );
}