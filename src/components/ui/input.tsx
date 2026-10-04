import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border border-input bg-[#0E1013] px-3.5 py-2 text-sm text-foreground transition-all outline-none placeholder:text-[#6B7280] focus:border-[#FF6B2C] focus:ring-1 focus:ring-[#FF6B2C] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
