import type { Metadata } from 'next'
import { Sora, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import Providers from '@/components/Providers'

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['300','400','500','600','700','800'] })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['300','400','500','600'] })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', weight: ['400','500'] })

export const metadata: Metadata = {
  title: 'CyberSalama — Community Cybersecurity Platform',
  description: 'CyberSalama protects Nairobi communities from digital fraud through SalamaBot WhatsApp chatbot, ThreatRadar live threat map, SalamaLearn security library, and SalamaWatch community reporting.',
  keywords: ['cybersecurity','Kenya','Nairobi','M-Pesa fraud','SIM swap','digital safety','WhatsApp bot'],
  authors: [{ name: 'Tito Kilonzo Kinyambu' }],
  openGraph: { title: 'CyberSalama', description: 'Your community cybersecurity platform.', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="font-body antialiased">
        <Providers>
          {children}
          <Toaster position="top-right" toastOptions={{
            style: { background: '#1e293b', border: '1px solid rgba(20,179,116,0.2)', color: '#f8fafc' },
          }} />
        </Providers>
      </body>
    </html>
  )
}
