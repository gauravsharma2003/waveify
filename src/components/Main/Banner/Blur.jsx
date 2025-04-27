import React, { useState, useEffect, useRef } from 'react'

function Blur({ imageUrl }) {
  const [prevColor, setPrevColor] = useState('rgba(1, 1, 1, 0.1)')
  const [currentColor, setCurrentColor] = useState('rgba(12, 12, 12, 0.2)')
  const [fading, setFading] = useState(false)
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
      if (sat > 0.2 && max > 40) samples.push({ r, g, b, sat })
    }
    if (samples.length) {
      samples.sort((a, b) => b.sat - a.sat || Math.max(b.r, b.g, b.b) - Math.max(a.r, a.g, a.b))
      const { r, g, b } = samples[0]
      const newColor = `rgba(${r}, ${g}, ${b}, 0.3)`
      setPrevColor(currentColor)
      setCurrentColor(newColor)
      setFading(true)
    }
  }

  useEffect(() => {
    if (fading) {
      const t = setTimeout(() => {
        setPrevColor(currentColor)
        setFading(false)
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [currentColor, fading])

  return (
    <>
      <img ref={imgRef} src={imageUrl} alt="" className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        {/* Static base shadow */}
        <div
          className="absolute inset-[-50%] rounded-full"
          style={{
            background: `radial-gradient(circle at center, ${prevColor} 0%, transparent 80%)`,
            filter: 'blur(120px)'
          }}
        />
        {/* Animated highlight shadow */}
        <div
          className="absolute inset-[-50%] rounded-full transition-opacity duration-2000 ease-in-out"
          style={{
            background: `radial-gradient(circle at center, ${currentColor} 0%, transparent 80%)`,
            filter: 'blur(120px)',
            opacity: fading ? 0 : 1
          }}
        />
      </div>
    </>
  )
}

export default Blur
