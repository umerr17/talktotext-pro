"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">TT</span>
              </div>
              <span className="font-bold text-lg sm:text-xl">TalkToText Pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">TT</span>
                      </div>
                      <span className="font-bold text-lg">TalkToText Pro</span>
                    </Link>
                  </div>

                  <div className="flex flex-col space-y-3 pt-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "px-3 py-3 rounded-md text-base font-medium transition-colors border-b border-border/50",
                          pathname === item.href
                            ? "text-primary bg-primary/10"
                            : "text-foreground hover:text-primary hover:bg-primary/5",
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  <div className="flex flex-col space-y-3 pt-6 border-t border-border/50">
                    <Button variant="ghost" asChild className="justify-start h-12 text-base">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className="h-12 text-base">
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
