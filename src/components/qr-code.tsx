import { useEffect, useRef } from "react"

interface QRCodeProps {
  value: string
  size?: number
  bgColor?: string
  fgColor?: string
}

export default function QRCode({ value, size = 128, bgColor = "#FFFFFF", fgColor = "#000000" }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // This is a simplified QR code renderer for demonstration
    // In a real app, you would use a library like qrcode.react
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    // Draw a simplified QR code pattern (just for visual representation)
    ctx.fillStyle = fgColor

    // Draw border
    ctx.fillRect(0, 0, size, 10)
    ctx.fillRect(0, 0, 10, size)
    ctx.fillRect(size - 10, 0, 10, size)
    ctx.fillRect(0, size - 10, size, 10)

    // Draw position detection patterns
    // Top-left
    ctx.fillRect(10, 10, 30, 30)
    ctx.fillStyle = bgColor
    ctx.fillRect(20, 20, 10, 10)
    ctx.fillStyle = fgColor

    // Top-right
    ctx.fillRect(size - 40, 10, 30, 30)
    ctx.fillStyle = bgColor
    ctx.fillRect(size - 30, 20, 10, 10)
    ctx.fillStyle = fgColor

    // Bottom-left
    ctx.fillRect(10, size - 40, 30, 30)
    ctx.fillStyle = bgColor
    ctx.fillRect(20, size - 30, 10, 10)
    ctx.fillStyle = fgColor

    // Draw some random data modules
    const blockSize = 5
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (Math.random() > 0.5) {
          const x = 50 + i * blockSize
          const y = 50 + j * blockSize
          ctx.fillRect(x, y, blockSize, blockSize)
        }
      }
    }
  }, [value, size, bgColor, fgColor])

  return <canvas ref={canvasRef} width={size} height={size} title={`QR Code: ${value}`} />
}
