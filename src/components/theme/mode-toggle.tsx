"use client"

import React, { useId, useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const emptySubscribe = () => () => {}
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

export const ThemeToggleButton3 = ({
  className = "",
}: {
  className?: string
}) => {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const uniqueId = useId()
  const clipId = `skiper-btn-${uniqueId.replace(/:/g, "")}`

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-9 w-9 rounded-full border border-border/50 bg-muted/40",
          className
        )}
      />
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className={cn(
        "group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 active:scale-95",
        isDark
          ? "border-white/15 bg-zinc-900/90 text-zinc-300 shadow-inner hover:border-amber-400/50 hover:bg-zinc-800 hover:text-amber-300 hover:shadow-[0_0_12px_rgba(251,191,36,0.2)]"
          : "border-zinc-300/80 bg-zinc-100 text-zinc-700 shadow-sm hover:border-zinc-400 hover:bg-zinc-200 hover:text-zinc-900",
        className
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        strokeLinecap="round"
        viewBox="0 0 32 32"
        className="h-4 w-4 transition-transform duration-200 group-hover:scale-105"
      >
        <clipPath id={clipId}>
          <motion.path
            initial={false}
            animate={{ y: isDark ? 14 : 0, x: isDark ? -11 : 0 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            d="M0-11h25a1 1 0 0017 13v30H0Z"
          />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <motion.circle
            initial={false}
            animate={{ r: isDark ? 10 : 8 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            cx="16"
            cy="16"
          />
          <motion.g
            initial={false}
            animate={{
              scale: isDark ? 0.5 : 1,
              opacity: isDark ? 0 : 1,
            }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M18.3 3.2c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3S14.7.9 16 .9s2.3 1 2.3 2.3zm-4.6 25.6c0-1.3 1-2.3 2.3-2.3s2.3 1 2.3 2.3-1 2.3-2.3 2.3-2.3-1-2.3-2.3zm15.1-10.5c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zM3.2 13.7c1.3 0 2.3 1 2.3 2.3s-1 2.3-2.3 2.3S.9 17.3.9 16s1-2.3 2.3-2.3zm5.8-7C9 7.9 7.9 9 6.7 9S4.4 8 4.4 6.7s1-2.3 2.3-2.3S9 5.4 9 6.7zm16.3 21c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zm2.4-21c0 1.3-1 2.3-2.3 2.3S23 7.9 23 6.7s1-2.3 2.3-2.3 2.4 1 2.4 2.3zM6.7 23C8 23 9 24 9 25.3s-1 2.3-2.3 2.3-2.3-1-2.3-2.3 1-2.3 2.3-2.3z" />
          </motion.g>
        </g>
      </svg>
    </button>
  )
}
