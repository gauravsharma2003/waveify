import React from 'react'

function Dropdown({ results, isLoading, onSongSelect }) {
  const songResults = results || []

  if (!songResults.length && !isLoading) {
    return <div></div>
  }

  if (isLoading && !songResults.length) {
    return (
      <div className="absolute w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl overflow-hidden z-10">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center p-3 border-b border-zinc-800 last:border-b-0">
            <div className="flex-shrink-0 w-12 h-12 mr-3 bg-zinc-800 rounded overflow-hidden relative">
              <div className="absolute inset-0 w-full h-full animate-shimmer bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%]"></div>
            </div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 bg-zinc-800 rounded w-3/4 relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full animate-shimmer bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%]"></div>
              </div>
              <div className="h-2 bg-zinc-800 rounded w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full animate-shimmer bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%]"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (songResults.length > 0) {
    return (
      <div className="absolute w-full mt-1 bg-gradient-to-b from-zinc-950 to-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden z-10">
        <ul className="divide-y divide-zinc-800">
          {songResults.map((song) => (
            <li 
              key={song.id} 
              className="flex items-center p-3 hover:bg-zinc-800 transition-colors cursor-pointer"
              onClick={() => onSongSelect && onSongSelect(song.id)}
            >
              <div className="flex-shrink-0 w-12 h-12 mr-3">
                <img 
                  src={song.imageUrl} 
                  alt={song.title} 
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                  }}
                />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-white font-bold text-sm truncate">{song.title}</h3>
                <p className="text-zinc-400 text-xs truncate">{song.artist}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return <div></div>
}

export default Dropdown
