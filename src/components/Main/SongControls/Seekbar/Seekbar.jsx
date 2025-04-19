import React, { useState } from 'react'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function Seekbar({ duration = 0, initialTime = 0, onSeek }) {
  const [value, setValue] = useState(initialTime)
  const [hover, setHover] = useState(false)
  const [hoverPos, setHoverPos] = useState(0)
  const [hoverTime, setHoverTime] = useState(0)

  const handleChange = (e) => {
    const val = Number(e.target.value)
    setValue(val)
    if (onSeek) onSeek(val)
  }

  const handleMouseMove = (e) => {
    const target = e.target
    const rect = target.getBoundingClientRect()
    const pos = e.clientX - rect.left
    const ratio = Math.max(0, Math.min(1, pos / rect.width))
    const time = ratio * duration
    setHover(true)
    setHoverPos(pos)
    setHoverTime(time)
  }

  const handleMouseLeave = () => setHover(false)

  const ratio = duration > 0 ? (value / duration) * 100 : 0

  return (
    <div className="w-full">
      <div
        className="relative w-full"
        onMouseEnter={() => setHover(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <input
          type="range"
          min="0"
          max={duration || 500}
          value={value}
          onChange={handleChange}
          style={{ background: `linear-gradient(to right, #ffffff ${ratio}%,rgb(118, 118, 118) ${ratio}%)` }}
          className="w-full h-1 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:hover:bg-zinc-300 transition-colors"
        />
        {hover && (
          <div
            className="absolute -top-6 bg-white text-black text-xs px-2 py-1 rounded shadow-lg pointer-events-none"
            style={{ left: hoverPos, transform: 'translateX(-50%)' }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>
      <div className="mt-1 text-xs text-gray-200">{formatTime(value)}</div>
    </div>
  )
}

export default Seekbar
