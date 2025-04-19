import React, { useState, useEffect, useRef } from 'react'

function Blur({ imageUrl }) {
  const [flareColor, setFlareColor] = useState('rgba(12, 12, 12, 0.3)')
  const canvasRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    if (!imageUrl) return
    const imgElement = imgRef.current
    imgElement.crossOrigin = 'anonymous'
    imgElement.onload = extractColors
    if (imgElement.complete) extractColors()
  }, [imageUrl])

  const extractColors = () => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    canvas.width = img.naturalWidth || 500
    canvas.height = img.naturalHeight || 500
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    let data
    try {
      data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    } catch (err) {
      console.error('Canvas getImageData failed:', err)
      return
    }
    const samples = []
    const sampleCount = 1000
    const totalPixels = canvas.width * canvas.height
    for (let i = 0; i < sampleCount; i++) {
      const idx = Math.floor(Math.random() * totalPixels) * 4
      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const sat = max === 0 ? 0 : (max - min) / max
      if (sat > 0.1 && max > 20) samples.push({ r, g, b })
    }
    if (samples.length) {
      samples.sort((a, b) => Math.max(b.r, b.g, b.b) - Math.max(a.r, a.g, a.b))
      const { r, g, b } = samples[0]
      setFlareColor(`rgba(${r}, ${g}, ${b}, 0.2)`)
    }
  }

  return (
    <>
      <img ref={imgRef} src={imageUrl} alt="" className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div
          className="absolute top-0 left-[-50%] w-[100%] h-[100%] rounded-full"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 50%, ${flareColor} 0%, transparent 70%)`,
            filter: 'blur(20px)'
          }}
        />
      </div>
    </>
  )
}

export default Blur
