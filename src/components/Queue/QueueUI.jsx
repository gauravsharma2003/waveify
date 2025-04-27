import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import QueueApi from './QueueApi';

function QueueUI({ artistId, currentSongId }) {
  const [queueItems, setQueueItems] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!artistId || !currentSongId) return;
    
    const fetchQueueData = async () => {
      setLoading(true);
      try {
        const queueData = await QueueApi(artistId, currentSongId);
        setQueueItems(queueData);
      } catch (error) {
        console.error('Error fetching queue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueData();
  }, [artistId, currentSongId]);

  const toggleExpanded = () => setExpanded(!expanded);

  if (loading) return <div className="p-3 text-gray-400">Loading queue...</div>;
  if (queueItems.length === 0) return null;

  const nextSong = queueItems[0];

  return (
    <div className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
      {/* Next Playing Song */}
      <div className="p-3 border-b border-zinc-700">
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
            onClick={toggleExpanded}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            {expanded ? 
              <ChevronUpIcon className="w-5 h-5" /> : 
              <ChevronDownIcon className="w-5 h-5" />
            }
          </button>
        </div>
      </div>

      {/* Expanded Queue List */}
      {expanded && queueItems.length > 1 && (
        <div className="max-h-60 overflow-y-auto">
          <ul className="divide-y divide-zinc-700">
            {queueItems.slice(1).map((song) => (
              <li key={song.id} className="p-3 flex items-center space-x-3 hover:bg-zinc-700">
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
        </div>
      )}
    </div>
  );
}

export default QueueUI;
