import React, { useState } from 'react'
import { Play, Pause } from 'lucide-react'

function PlayPause({ isPlaying: initial = false, onToggle }) {
  const [isPlaying, setIsPlaying] = useState(initial)

  const handleClick = () => {
    const next = !isPlaying
    setIsPlaying(next)
    if (onToggle) onToggle(next)
  }

  return (
    <button
      onClick={handleClick}
      className="p-3 bg-zinc-900 rounded-full border border-zinc-300 hover:bg-zinc-800 hover:border-zinc-400 transition-colors duration-200 focus:outline-none"
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? (
        <Pause className="w-6 h-6 text-white hover:text-zinc-300 transition-colors duration-200" />
      ) : (
        <Play className="w-6 h-6 text-white hover:text-zinc-300 transition-colors duration-200" />
      )}
    </button>
  )
}

export default PlayPause
