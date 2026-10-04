"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "@/components/ui/Logo"
import { Button } from "@/components/ui/button"
import { Sparkles, Database, Flame, History } from "lucide-react"

interface MobileNavbarProps {
  onOpenHistory?: () => void
  showHistory?: boolean
}

export default function MobileNavbar({ onOpenHistory, showHistory = false }: MobileNavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-2 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          aria-label="Toggle Menu"
          className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-900 transition-colors hover:bg-zinc-200/50 dark:text-white dark:hover:bg-white/10"
        >
          <div className="flex flex-col items-center justify-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full bg-current" />
            <span className="h-0.5 w-4 rounded-full bg-current" />
            <span className="h-0.5 w-4 rounded-full bg-current" />
          </div>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="flex w-[85vw] max-w-xs flex-col justify-between border-border/50 bg-background/95 p-6 backdrop-blur-xl"
        >
          <div className="space-y-6">
            <SheetHeader className="text-left">
              <SheetTitle className="flex items-center gap-2.5">
                <Logo size={24} />
              </SheetTitle>
            </SheetHeader>

            {onOpenHistory && (
              <Button
                variant="outline"
                onClick={() => {
                  onOpenHistory()
                  setOpen(false)
                }}
                className="w-full justify-start text-xs border-border bg-muted/20 hover:bg-muted text-foreground gap-2 h-10"
              >
                <History className="h-4 w-4 text-[#FF6B2C]" />
                {showHistory ? "Back to Setup" : "Past Sessions (MongoDB Atlas)"}
              </Button>
            )}

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Sparkles className="h-4 w-4 text-[#FF6B2C]" />
                  Active AI Engine
                </div>
                <div className="text-muted-foreground leading-relaxed">
                  <div className="text-foreground font-medium">Google Gemma 2 27B</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Primary Low-Latency Gateway</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Flame className="h-4 w-4 text-[#FF6B2C]" />
                  Inference Provider
                </div>
                <div className="text-muted-foreground leading-relaxed">
                  <div className="text-foreground font-medium">Backboard.io API</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Failover: OpenRouter Free Tier</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Database className="h-4 w-4 text-[#FF6B2C]" />
                  Database Persistence
                </div>
                <div className="text-muted-foreground leading-relaxed">
                  <div className="text-foreground font-medium">MongoDB Atlas</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Database: preppulse • Sessions</div>
                </div>
              </div>
            </div>
          </div>

        </SheetContent>
      </Sheet>
    </div>
  )
}
