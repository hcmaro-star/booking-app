// app/layout.tsx
import React from "react";
import 'react-day-picker/dist/style.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Noto Sans KR, Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
