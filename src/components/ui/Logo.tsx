"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: number
}

export const Logo = ({ className = "", size = 32 }: LogoProps) => {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={cn(
          "relative flex items-center justify-center text-[#FF6B2C] transition-transform duration-200 hover:scale-105",
          className
        )}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full fill-current text-current"
        >
          {/* Left Chevron - Scaled & Thickened */}
          <path
            d="M 38 12 
               L 12 28 
               L 12 66 
               L 44 88 
               L 60 76 
               L 32 56 
               L 32 30 
               Z"
            fill="currentColor"
          />

          {/* Right Chevron - Spaced Further Out */}
          <path
            d="M 72 12 
               L 52 25 
               L 52 56 
               L 80 76 
               L 94 64 
               L 68 46 
               L 68 28 
               Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <span className="font-extrabold tracking-tight text-foreground" style={{ fontSize: size * 0.65 }}>
        Prep<span className="text-[#FF6B2C]">Pulse</span>
      </span>
    </div>
  )
}

export default Logo
