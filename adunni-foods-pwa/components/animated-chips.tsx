"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

interface FloatingChip {
  id: number
  x: string | number
  y: string | number
  size: "sm" | "md" | "lg"
  delay: number
  duration: number
  rotation: number
}

export function AnimatedChips() {
  const chips = useMemo<FloatingChip[]>(() => {
    return [
      // Top left area
      { id: 1, x: "5%", y: "10%", size: "lg", delay: 0, duration: 8, rotation: -15 },
      { id: 2, x: "8%", y: "35%", size: "sm", delay: 0.2, duration: 10, rotation: 25 },
      { id: 3, x: "12%", y: "60%", size: "md", delay: 0.4, duration: 9, rotation: -30 },

      // Top right area
      { id: 4, x: "92%", y: "15%", size: "md", delay: 0.1, duration: 10, rotation: 20 },
      { id: 5, x: "88%", y: "42%", size: "lg", delay: 0.3, duration: 9, rotation: -25 },
      { id: 6, x: "85%", y: "70%", size: "sm", delay: 0.5, duration: 11, rotation: 35 },

      // Center-top area
      { id: 7, x: "50%", y: "5%", size: "sm", delay: 0.15, duration: 8.5, rotation: -20 },
      { id: 8, x: "45%", y: "80%", size: "md", delay: 0.35, duration: 9.5, rotation: 15 },

      // Additional floating chips for depth
      { id: 9, x: "75%", y: "25%", size: "sm", delay: 0.25, duration: 10, rotation: -35 },
      { id: 10, x: "25%", y: "75%", size: "sm", delay: 0.45, duration: 9, rotation: 40 },
    ]
  }, [])

  const sizeClasses = {
    sm: "w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20",
    md: "w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32",
    lg: "w-20 h-20 md:w-28 md:h-28 lg:w-40 lg:h-40",
  }

  const opacityMap = {
    sm: "opacity-40",
    md: "opacity-50",
    lg: "opacity-60",
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {chips.map((chip) => (
        <motion.div
          key={chip.id}
          className={`absolute ${sizeClasses[chip.size]} ${opacityMap[chip.size]}`}
          initial={{
            x: typeof chip.x === "string" ? undefined : chip.x,
            y: typeof chip.y === "string" ? undefined : chip.y,
            opacity: 0,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [chip.rotation, chip.rotation + 360],
            opacity: opacityMap[chip.size] === "opacity-40" ? [0.3, 0.5, 0.3] : 
                     opacityMap[chip.size] === "opacity-50" ? [0.4, 0.6, 0.4] :
                     [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: chip.duration,
            delay: chip.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: chip.x,
            top: chip.y,
          }}
        >
          <ChipGraphic size={chip.size} />
        </motion.div>
      ))}
    </div>
  )
}

function ChipGraphic({ size }: { size: "sm" | "md" | "lg" }) {
  return (
    <div className="w-full h-full relative">
      {/* Main chip body */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-2xl filter blur-sm"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`chipGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#FFA726", stopOpacity: 0.9 }} />
            <stop offset="50%" style={{ stopColor: "#FFB74D", stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: "#FB8C00", stopOpacity: 0.85 }} />
          </linearGradient>

          <filter id={`shadow-${size}`}>
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Chip shape - wavy/curved edges */}
        <path
          d="M 30 20 Q 25 25, 20 35 Q 15 45, 20 55 Q 25 65, 30 70 Q 40 78, 50 80 Q 60 78, 70 70 Q 75 65, 80 55 Q 85 45, 80 35 Q 75 25, 70 20 Q 60 15, 50 15 Q 40 15, 30 20"
          fill={`url(#chipGradient-${size})`}
          filter={`url(#shadow-${size})`}
          opacity="0.95"
        />

        {/* Highlight/shine effect */}
        <ellipse cx="35" cy="30" rx="15" ry="10" fill="white" opacity="0.3" />

        {/* Texture details */}
        <circle cx="45" cy="45" r="3" fill="rgba(0,0,0,0.1)" />
        <circle cx="55" cy="50" r="2" fill="rgba(0,0,0,0.08)" />
        <circle cx="40" cy="60" r="2.5" fill="rgba(0,0,0,0.1)" />
        <circle cx="60" cy="40" r="2" fill="rgba(0,0,0,0.08)" />

        {/* Edge highlight */}
        <path
          d="M 30 20 Q 25 25, 20 35"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Glow effect background */}
      <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-orange-400/30 to-orange-600/20 blur-2xl scale-150" />
    </div>
  )
}
