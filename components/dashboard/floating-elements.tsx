"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, Zap, Target, Award } from "lucide-react"

const floatingIcons = [
  { Icon: Sparkles, delay: 0, duration: 8 },
  { Icon: Zap, delay: 2, duration: 6 },
  { Icon: Target, delay: 4, duration: 10 },
  { Icon: Award, delay: 6, duration: 7 },
]

export function FloatingElements() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Don't render anything on the server or during the initial client render
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {floatingIcons.map(({ Icon, delay, duration }, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/10"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: 0,
            scale: 0.5,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: 360,
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration,
            delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Icon className="h-8 w-8" />
        </motion.div>
      ))}

      {/* Gradient orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            background: `radial-gradient(circle, ${
              i === 0 ? "hsl(var(--primary))" : i === 1 ? "hsl(var(--chart-2))" : "hsl(var(--chart-3))"
            } 0%, transparent 70%)`,
            width: 300 + i * 100,
            height: 300 + i * 100,
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}