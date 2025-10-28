"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface RotatingTextProps {
  texts: string[]
  className?: string
}

export function RotatingText({ texts, className }: RotatingTextProps) {
  return (
    <div className={cn("inline-block", className)}>
      <motion.span
        className="inline-block"
        animate={{ opacity: [1, 0, 1] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.5, 1],
        }}
      >
        {texts.map((text, index) => (
          <motion.span
            key={index}
            className="inline-block absolute"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {text}
          </motion.span>
        ))}
      </motion.span>
    </div>
  )
}