"use client"

import React, { useState, useRef } from "react"

interface SpecularButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg"
  radius?: number
  tint?: string
  tintOpacity?: number
  blur?: number
  textColor?: string
  lineColor?: string
  baseColor?: string
  intensity?: number
  shineSize?: number
  shineFade?: number
  thickness?: number
  speed?: number
  followMouse?: boolean
  proximity?: number
  autoAnimate?: boolean
  className?: string
  children: React.ReactNode
}

export default function SpecularButton({
  size = "sm",
  radius = 999,
  tint = "#ffffff",
  textColor = "#ffffff",
  lineColor = "#FF6B2C",
  className = "",
  children,
  onClick,
  ...props
}: SpecularButtonProps) {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseLeave = () => {
    setMousePos(null)
  }

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        borderRadius: radius,
        color: textColor,
      }}
      className={`relative inline-flex items-center justify-center overflow-hidden border border-[#FF6B2C]/40 bg-gradient-to-r from-[#FF6B2C] to-[#E04800] font-medium shadow-md shadow-orange-950/40 transition-all hover:opacity-95 hover:shadow-lg active:scale-95 ${className}`}
      {...props}
    >
      {mousePos && (
        <span
          className="pointer-events-none absolute -inset-px opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(120px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.6), transparent 70%)`,
          }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
    </button>
  )
}
