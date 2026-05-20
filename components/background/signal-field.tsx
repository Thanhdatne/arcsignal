"use client"

import { useEffect, useRef } from "react"

type Dot = {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  glow: number
}

type Ripple = {
  x: number
  y: number
  radius: number
  alpha: number
}

export function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dotsRef = useRef<Dot[]>([])
  const ripplesRef = useRef<Ripple[]>([])
  const frameRef = useRef<number | null>(null)

  const mouseRef = useRef({
    x: -9999,
    y: -9999,
    active: false,
  })

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const rawContext = canvas.getContext("2d")

    if (!rawContext) return

    const context: CanvasRenderingContext2D = rawContext

    function resize() {
      const currentCanvas = canvasRef.current

      if (!currentCanvas) return

      const dpr = window.devicePixelRatio || 1

      currentCanvas.width = window.innerWidth * dpr
      currentCanvas.height = window.innerHeight * dpr
      currentCanvas.style.width = `${window.innerWidth}px`
      currentCanvas.style.height = `${window.innerHeight}px`

      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const spacing = 24
      const dots: Dot[] = []

      for (let y = spacing; y < window.innerHeight; y += spacing) {
        for (let x = spacing; x < window.innerWidth; x += spacing) {
          dots.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
            glow: 0,
          })
        }
      }

      dotsRef.current = dots
    }

    function animate() {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const mouse = mouseRef.current

      for (const dot of dotsRef.current) {
        const dx = dot.x - mouse.x
        const dy = dot.y - mouse.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (mouse.active && distance < 145) {
          const force = Math.sin((1 - distance / 145) * Math.PI) * 0.55
          const angle = Math.atan2(dy, dx)

          dot.vx += Math.cos(angle) * force
          dot.vy += Math.sin(angle) * force
          dot.glow = Math.min(1, dot.glow + 0.045)
        } else {
          dot.glow *= 0.94
        }

        dot.vx += (dot.baseX - dot.x) * 0.02
        dot.vy += (dot.baseY - dot.y) * 0.02
        dot.vx *= 0.9
        dot.vy *= 0.9

        dot.x += dot.vx
        dot.y += dot.vy

        const size = 0.85 + dot.glow * 0.85
        const opacity = 0.12 + dot.glow * 0.42

        context.beginPath()
        context.fillStyle = `rgba(52, 211, 153, ${opacity})`
        context.arc(dot.x, dot.y, size, 0, Math.PI * 2)
        context.fill()
      }

      for (let index = ripplesRef.current.length - 1; index >= 0; index--) {
        const ripple = ripplesRef.current[index]

        if (!ripple) continue

        context.beginPath()
        context.strokeStyle = `rgba(52, 211, 153, ${ripple.alpha})`
        context.lineWidth = 1
        context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
        context.stroke()

        ripple.radius += 2.6
        ripple.alpha *= 0.94

        if (ripple.alpha < 0.015) {
          ripplesRef.current.splice(index, 1)
        }
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    function onMouseMove(event: MouseEvent) {
      mouseRef.current = {
        x: event.clientX,
        y: event.clientY,
        active: true,
      }
    }

    function onMouseLeave() {
      mouseRef.current.active = false
    }

    function onClick(event: MouseEvent) {
      ripplesRef.current.push({
        x: event.clientX,
        y: event.clientY,
        radius: 12,
        alpha: 0.22,
      })
    }

    resize()
    animate()

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseleave", onMouseLeave)
    window.addEventListener("click", onClick)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseleave", onMouseLeave)
      window.removeEventListener("click", onClick)

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-90"
      aria-hidden="true"
    />
  )
}