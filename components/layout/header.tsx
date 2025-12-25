"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, User, X } from "lucide-react";
import { useState } from "react";
import logoImage from "@assets/the_sedder_main_logo_1766672612999.png";

interface HeaderProps {
  user?: { email: string } | null;
}

export function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src={logoImage} 
            alt="TheSedder" 
            width={120} 
            height={40} 
            className="h-10 w-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">
            Shop
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/library">
                <Button variant="ghost" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  My Library
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-4">
          <Link href="/shop" className="block text-sm font-medium hover:text-primary">
            Shop
          </Link>
          <Link href="/about" className="block text-sm font-medium hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="block text-sm font-medium hover:text-primary">
            Contact
          </Link>
          <div className="pt-4 border-t space-y-2">
            {user ? (
              <>
                <Link href="/library" className="block">
                  <Button variant="outline" className="w-full">My Library</Button>
                </Link>
                <Link href="/profile" className="block">
                  <Button variant="ghost" className="w-full">Profile</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
