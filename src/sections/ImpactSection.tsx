import { useEffect, useRef, useState } from "react"
import type { ImpactStat } from "../data/impactStats"
import { impactStats } from "../data/impactStats"

function parseStatValue(value: string): { numeric: number; suffix: string } {
  const match = value.match(/^([\d,]+)(.*)$/)
  if (!match) return { numeric: 0, suffix: value }
  const numStr = match[1].replace(/,/g, "")
  const suffix = match[2] ?? ""
  const numeric = Number.parseInt(numStr, 10)
  return { numeric: Number.isNaN(numeric) ? 0 : numeric, suffix }
}

function formatNumber(n: number, hasCommas: boolean): string {
  return hasCommas ? n.toLocaleString() : String(n)
}

const DURATION_MS = 2000

function StatItem({
  stat,
  startAnimation,
}: {
  stat: ImpactStat
  startAnimation: boolean
}) {
  const { numeric: target, suffix } = parseStatValue(stat.value)
  const hasCommas = stat.value.includes(",")
  const [displayValue, setDisplayValue] = useState("0")
  const startedRef = useRef(false)

  useEffect(() => {
    if (!startAnimation || startedRef.current || target === 0) return
    startedRef.current = true
    const startTime = performance.now()
    let rafId: number

    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / DURATION_MS, 1)
      const current = Math.floor(t * target)
      setDisplayValue(formatNumber(current, hasCommas))
      if (t < 1) rafId = requestAnimationFrame(tick)
      else setDisplayValue(formatNumber(target, hasCommas))
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [startAnimation, target, suffix, hasCommas])

  const display = startAnimation ? displayValue + (suffix || "") : "0" + suffix

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <p className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl md:text-5xl lg:text-6xl">
        {display}
      </p>
      <p className="mt-1 font-display text-[11px] font-bold text-white sm:text-sm md:mt-1.5 md:text-lg lg:text-[21px]">
        {stat.label}
      </p>
    </div>
  )
}

export function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [startAnimation, setStartAnimation] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setStartAnimation(true)
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#12011D] px-4 "
    >
      <div className="relative z-10 mx-auto max-w-[1509px]">
        <div
          className="grid grid-cols-2 gap-x-2 gap-y-8 rounded-3xl px-4 py-6 lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:px-6 "
          style={{
            background: "linear-gradient(90deg, #7A4CDB 0%, #6366F4 50%, #36f4db 100%)",
          }}
        >
          {impactStats.map((stat) => (
            <StatItem key={stat.label} stat={stat} startAnimation={startAnimation} />
          ))}
        </div>
      </div>
      <div className="bg-black h-1/2 w-full absolute bottom-0 left-0"></div>
    </section>
  )
}
