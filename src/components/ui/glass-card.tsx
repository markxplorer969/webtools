import * as React from "react"
import { cn } from "@/lib/utils"

const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "glass rounded-xl p-6 backdrop-blur-xl bg-white/5 border border-gray-700/50 shadow-xl",
        className
      )}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(68, 68, 68, 0.5)',
      }}
      {...props}
    />
  )
})

GlassCard.displayName = "GlassCard"

export { GlassCard }