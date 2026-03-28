import { useEffect } from 'react'
import { CAT_COLORS } from '../constants/categories'

export default function PieChart({ active, entries }) {
  const canvasSize = { w: 160, h: 160 }

  useEffect(() => {
    if (!active) return

    const canvas = document.getElementById('pieCanvas')
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const total = entries.reduce((s, [, v]) => s + v, 0)

    // Background ring
    ctx.beginPath()
    ctx.arc(canvasSize.w / 2, canvasSize.h / 2, 36, 0, Math.PI * 2)
    ctx.fillStyle =
      getComputedStyle(document.documentElement).getPropertyValue('--color-background-primary').trim() ||
      '#ffffff'
    ctx.fill()

    if (!total || total <= 0) return

    let angle = -Math.PI / 2
    entries.forEach(([cat, val]) => {
      const slice = (val / total) * Math.PI * 2
      if (slice <= 0) return

      ctx.beginPath()
      ctx.moveTo(canvasSize.w / 2, canvasSize.h / 2)
      ctx.arc(canvasSize.w / 2, canvasSize.h / 2, 72, angle, angle + slice)
      ctx.closePath()
      ctx.fillStyle = CAT_COLORS[cat] || '#888'
      ctx.fill()

      angle += slice
    })
  }, [active, entries])

  return <canvas id="pieCanvas" width={canvasSize.w} height={canvasSize.h}></canvas>
}