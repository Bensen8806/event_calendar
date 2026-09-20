import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"

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
          {/* Navigation Bar */}
          <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/logo.jpg" alt="NSSCE Logo" width={40} height={40} className="rounded-md object-contain bg-white p-1" />
                <div className="hidden sm:block">
                  <span className="font-poppins text-lg font-bold">NSSCE</span>
                  <span className="ml-1 text-sm text-muted-foreground">Events</span>
                </div>
              </Link>
              <div className="flex items-center space-x-4">
                <Link href="/map" className={buttonVariants({ variant: "ghost" })}>
                  Campus Map
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "relative h-8 w-8 rounded-full" })}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">CH</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Club Head (IEEE)</p>
                        <p className="text-xs leading-none text-muted-foreground">ieee@nssce.ac.in</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/dashboard" className="w-full">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/login" className="w-full">Log out</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Separator />
          </nav>
          
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
