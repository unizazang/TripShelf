import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TripShelf",
  description: "여행 기록을 남기고, 그 기록을 책으로 연결하는 콘텐츠 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}