"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-lg backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-6 py-4 md:px-10">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2 text-lg font-semibold transition-colors hover:text-primary">
            <span className="hidden sm:inline-block">Todo App</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden border border-primary shadow-md hover:shadow-lg transition-transform hover:scale-105">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                    <AvatarFallback className="text-primary bg-muted">
                      {session.user.name
                        ? session.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-lg border border-muted shadow-xl bg-popover" align="end" forceMount>
                <DropdownMenuItem className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="transition-colors hover:text-primary">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer transition-colors hover:text-destructive"
                  onSelect={(event) => {
                    event.preventDefault()
                    signOut({
                      callbackUrl: `${window.location.origin}/login`,
                    })
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            pathname !== "/login" &&
            pathname !== "/register" && (
              <Link href="/login">
                <Button size="sm" className="px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/90">Sign In</Button>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}
