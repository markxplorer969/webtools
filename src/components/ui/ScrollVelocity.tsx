"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface ScrollVelocityProps {
  text: string
  className?: string
}

export function ScrollVelocity({ text, className }: ScrollVelocityProps) {
  const { scrollYProgress } = useScroll()
  const x = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <motion.div
      className={cn("whitespace-nowrap", className)}
      style={{ x }}
    >
      {text}
    </motion.div>
  )
}