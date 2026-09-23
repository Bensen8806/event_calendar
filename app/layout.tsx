import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

import { TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import Navbar from '@/components/layout/Navbar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'NSSCE Event Management System',
  description: 'NSS College of Engineering, Palakkad — Event Management and Venue Booking System.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn('dark', inter.variable, poppins.variable)}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <TooltipProvider>
          <div className="relative flex min-h-screen flex-col">
          <Navbar />
          
          <main className="flex-1">{children}</main>
          
          <footer className="py-6 md:py-0">
            <Separator />
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built for NSS College of Engineering, Palakkad.
              </p>
              <p className="text-center text-sm font-medium italic text-muted-foreground">
                &quot;Uddhared atmanAtmanam&quot;
              </p>
            </div>
          </footer>
        </div>
        </TooltipProvider>
      </body>
    </html>
  )
}
