"use client"

import React from "react"
import { Sparkles, Zap } from "lucide-react"

export default function DesktopNavbar() {
  return (
    <nav className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center md:flex">
      <div className="group relative flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-xs backdrop-blur-xl transition-all hover:border-[#FF6B2C]/40 hover:shadow-[0_0_15px_rgba(255,107,44,0.15)]">
        {/* Pulsing Green Status Dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>

        {/* Model Chip Content */}
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
          <Zap className="h-3.5 w-3.5 text-[#FF6B2C] fill-[#FF6B2C]/20" />
          <span className="font-semibold text-foreground tracking-tight">
            Gemma 2 27B
          </span>
          <span className="text-muted-foreground/60">•</span>
          <span className="text-muted-foreground text-[11px]">Backboard</span>
        </div>
      </div>
    </nav>
  )
}
