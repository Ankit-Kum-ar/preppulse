import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border border-input bg-[#0E1013] px-3.5 py-3 text-sm text-foreground transition-all outline-none placeholder:text-[#6B7280] focus:border-[#FF6B2C] focus:ring-1 focus:ring-[#FF6B2C] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
