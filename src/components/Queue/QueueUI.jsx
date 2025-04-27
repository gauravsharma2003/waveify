import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

function QueueUI({ queueItems, currentSongId, onSongSelect }) {
  const [expanded, setExpanded] = useState(false);

  // Debug log to verify
  useEffect(() => {
    console.log("Queue UI expanded state:", expanded);
    console.log("Queue items:", queueItems);
  }, [expanded, queueItems]);

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  // Early return if no queue items
  if (!queueItems || queueItems.length === 0) return null;

  // Make a copy of the queue items to avoid mutating props
  const queueCopy = [...queueItems];
  
  // Find current song index
  const currentIndex = queueCopy.findIndex(song => song.id === currentSongId);
  
  // Create a rearranged queue with current song removed and the rest in order
  let orderedQueue = [];
  if (currentIndex !== -1) {
    // Add all songs after current song
    orderedQueue = [...queueCopy.slice(currentIndex + 1)];
    // Add all songs before current song
    orderedQueue = [...orderedQueue, ...queueCopy.slice(0, currentIndex)];
  } else {
    orderedQueue = queueCopy;
  }

  // If no songs in queue after filtering, return null
  if (orderedQueue.length === 0) return null;

  // The first song in ordered queue is next to play
  const nextSong = orderedQueue[0];

  return (
    <div className="bg-zinc-800 rounded-lg shadow-lg relative">
      {/* Next Playing Song - Now clickable too */}
      <div 
        className="p-3 border-b border-zinc-700 cursor-pointer hover:bg-zinc-700"
        onClick={() => onSongSelect(nextSong.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={nextSong.image} 
              alt={nextSong.name}
              className="w-12 h-12 object-cover rounded"
              onError={(e) => {e.target.src = 'https://via.placeholder.com/80'}}
            />
            <div>
              <h3 className="text-xs font-medium text-gray-400">NEXT PLAYING</h3>
              <p className="text-white font-medium">{nextSong.name}</p>
              <p className="text-sm text-gray-400">{nextSong.artist}</p>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering parent onClick
              toggleExpanded();
            }}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle queue expansion"
          >
            {expanded ? 
              <ChevronUpIcon className="w-5 h-5" /> : 
              <ChevronDownIcon className="w-5 h-5" />
            }
          </button>
        </div>
      </div>

      {/* Expanded Queue List - Separate from main component, fixed position */}
      {expanded && (
        <div className="absolute top-full left-0 right-0 bg-zinc-800 max-h-60 overflow-y-auto z-50 rounded-b-lg shadow-xl border border-zinc-700 mt-0.5">
          {orderedQueue.length <= 1 ? (
            <div className="p-3 text-gray-400 text-center">No more songs in queue</div>
          ) : (
            <ul className="divide-y divide-zinc-700">
              {orderedQueue.slice(1).map((song) => (
                <li 
                  key={song.id} 
                  className="p-3 flex items-center space-x-3 hover:bg-zinc-700 cursor-pointer"
                  onClick={() => onSongSelect(song.id)}
                >
                  <img 
                    src={song.image} 
                    alt={song.name}
                    className="w-10 h-10 object-cover rounded"
                    onError={(e) => {e.target.src = 'https://via.placeholder.com/40'}}
                  />
                  <div>
                    <p className="text-white text-sm font-medium">{song.name}</p>
                    <p className="text-xs text-gray-400">{song.artist}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default QueueUI;
