"use client"

import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { History } from "lucide-react"
import DesktopNavbar from "./DesktopNavbar"
import MobileNavbar from "./MobileNavbar"
import { Logo } from "@/components/ui/Logo"
import { Button } from "@/components/ui/button"

const emptySubscribe = () => () => {}
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

interface NavbarProps {
  onOpenHistory?: () => void
  showHistory?: boolean
}

export default function Navbar({ onOpenHistory, showHistory = false }: NavbarProps) {
  const mounted = useMounted()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 30)
  })

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-300">
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 32,
        }}
        animate={{
          width: scrolled ? "min(92%, 840px)" : "100%",
          y: scrolled ? 16 : 0,
          borderRadius: scrolled ? 9999 : 0,
        }}
        className={`pointer-events-auto relative backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? "border border-zinc-200/80 bg-white/85 text-zinc-900 shadow-[0_12px_36px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-zinc-950/85 dark:text-white dark:shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
            : "border-b border-zinc-200/50 bg-white/75 text-zinc-900 shadow-xs dark:border-b-white/5 dark:bg-zinc-950/75 dark:text-white"
        }`}
      >
        <div
          className={`relative mx-auto flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-14 px-5 sm:px-7" : "h-16 max-w-7xl px-6 sm:px-8"
          }`}
        >
          {/* Left Brand Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-3 font-bold tracking-tight text-zinc-900 transition-transform duration-200 hover:opacity-90 active:scale-95 dark:text-white"
            >
              <Logo size={scrolled ? 24 : 28} />
            </Link>
          </div>

          {/* Centered Minimalist Gemma 2 Status Pill */}
          <DesktopNavbar />

          {/* Right Action Controls: Past Sessions Button */}
          <div className="hidden items-center gap-2.5 md:flex">
            {onOpenHistory && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenHistory}
                className={`h-9 px-3 rounded-full text-xs font-medium gap-1.5 transition-all ${
                  showHistory
                    ? "bg-[#281A12] text-[#FF6B2C] border-[#FF6B2C]/40 shadow-xs"
                    : "border-border/80 bg-background/80 text-muted-foreground hover:text-foreground hover:border-[#FF6B2C]/30"
                }`}
              >
                <History className="h-3.5 w-3.5 text-[#FF6B2C]" />
                <span>{showHistory ? "Back to Setup" : "Past Sessions"}</span>
              </Button>
            )}
          </div>

          {/* Mobile Drawer */}
          <MobileNavbar onOpenHistory={onOpenHistory} showHistory={showHistory} />
        </div>
      </motion.div>
    </header>
  )
}
