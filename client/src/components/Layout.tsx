import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 ease-in-out">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-lg tracking-tight group-hover:opacity-80 transition-opacity">
              Minimal Reader
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {!isHome && (
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                Table of Contents
              </Link>
            )}
            <div className="w-px h-4 bg-border hidden sm:block" />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-auto py-12 text-center text-sm text-muted-foreground">
        <div className="max-w-4xl mx-auto px-4">
          <p className="font-serif italic opacity-70">"Reading is essential for those who seek to rise above the ordinary."</p>
          <p className="mt-4 opacity-50">&copy; {new Date().getFullYear()} Minimal Reader. Crafted with precision.</p>
        </div>
      </footer>
    </div>
  );
}
