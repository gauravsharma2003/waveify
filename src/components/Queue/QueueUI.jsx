import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, QueueListIcon } from '@heroicons/react/24/outline';

function QueueUI({ queueItems, currentSongId, onSongSelect }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    console.log("Queue UI expanded state:", expanded);
    console.log("Queue items:", queueItems);
  }, [expanded, queueItems]);

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  if (!queueItems || queueItems.length === 0) return null;

  const queueCopy = [...queueItems];
  
  const currentIndex = queueCopy.findIndex(song => song.id === currentSongId);
  
  let orderedQueue = [];
  if (currentIndex !== -1) {
    orderedQueue = [...queueCopy.slice(currentIndex + 1)];
    orderedQueue = [...orderedQueue, ...queueCopy.slice(0, currentIndex)];
  } else {
    orderedQueue = queueCopy;
  }

  if (orderedQueue.length === 0) return null;


  const nextSong = orderedQueue[0];

  return (
    <div className="relative">
      <button 
        onClick={toggleExpanded}
        className="md:hidden relative flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-full p-2 text-white shadow-lg transition-colors"
        aria-label="Toggle queue"
      >
        <QueueListIcon className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-purple-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {orderedQueue.length}
        </span>
      </button>

      <div className="hidden md:block bg-zinc-800/90 backdrop-blur-md rounded-lg shadow-lg overflow-hidden w-[280px]">
        <div 
          className="p-3 border-b border-zinc-700/50 cursor-pointer hover:bg-zinc-700/70 transition-colors h-[72px] flex items-center"
          onClick={() => onSongSelect(nextSong.id)}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <img 
                src={nextSong.image} 
                alt={nextSong.name}
                className="w-12 h-12 object-cover rounded shadow flex-shrink-0"
                onError={(e) => {e.target.src = 'https://via.placeholder.com/80'}}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-medium text-purple-400">NEXT UP</h3>
                <p className="text-white font-medium truncate max-w-[170px]">{nextSong.name}</p>
                <p className="text-sm text-gray-400 truncate max-w-[170px]">{nextSong.artist}</p>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation(); 
                toggleExpanded();
              }}
              className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-zinc-700 flex-shrink-0 ml-1"
              aria-label="Toggle queue expansion"
            >
              {expanded ? 
                <ChevronUpIcon className="w-5 h-5" /> : 
                <ChevronDownIcon className="w-5 h-5" />
              }
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="absolute right-0 top-full mt-2 md:mt-0.5 bg-zinc-800/95 backdrop-blur-md w-80 md:w-[280px] max-h-[300px] overflow-y-auto z-50 rounded-lg shadow-xl border border-zinc-700/50">
          <div className="p-2 border-b border-zinc-700/50 flex items-center justify-between md:hidden">
            <h3 className="text-white font-medium">Queue</h3>
            <button 
              onClick={toggleExpanded}
              className="p-1 text-gray-400 hover:text-white"
            >
              <ChevronUpIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="md:hidden">
            <div 
              className="p-3 border-b border-zinc-700/50 bg-zinc-700/30 flex items-center space-x-3 cursor-pointer"
              onClick={() => {
                onSongSelect(nextSong.id);
                setExpanded(false);
              }}
            >
              <img 
                src={nextSong.image} 
                alt={nextSong.name}
                className="w-10 h-10 object-cover rounded"
                onError={(e) => {e.target.src = 'https://via.placeholder.com/40'}}
              />
              <div>
                <h3 className="text-xs font-medium text-purple-400">NEXT UP</h3>
                <p className="text-white text-sm font-medium">{nextSong.name}</p>
                <p className="text-xs text-gray-400">{nextSong.artist}</p>
              </div>
            </div>
          </div>
          
          {orderedQueue.length <= 1 ? (
            <div className="p-3 text-gray-400 text-center">No more songs in queue</div>
          ) : (
            <ul className="divide-y divide-zinc-700/50">
              {orderedQueue.slice(1).map((song) => (
                <li 
                  key={song.id} 
                  className="p-3 flex items-center space-x-3 hover:bg-zinc-700/50 cursor-pointer transition-colors"
                  onClick={() => {
                    onSongSelect(song.id);
                    setExpanded(false); 
                  }}
                >
                  <img 
                    src={song.image} 
                    alt={song.name}
                    className="w-10 h-10 object-cover rounded shadow flex-shrink-0"
                    onError={(e) => {e.target.src = 'https://via.placeholder.com/40'}}
                  />
                  <div className="overflow-hidden flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{song.name}</p>
                    <p className="text-xs text-gray-400 truncate">{song.artist}</p>
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
