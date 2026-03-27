import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '교랑샵 - 교랑 캐릭터 굿즈',
  description: '교랑 캐릭터 공식 굿즈샵',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}