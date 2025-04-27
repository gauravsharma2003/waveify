import React, { useState, useEffect } from 'react'
import Searchbox from '../Search/Searchbox'
import Banner from './Banner/Banner'
import Songcontrol from './SongControls/Songcontrol'
import SongData from './SongData/SongData'
import LyricApi from './Lyrics/LyricApi'
import { getSongDetails } from './Api'
import QueueApi from '../Queue/QueueApi'
import QueueUI from '../Queue/QueueUI'

function Main() {
  const [selectedSongId, setSelectedSongId] = useState(null)
  const [songDetails, setSongDetails] = useState(null)
  const [queueItems, setQueueItems] = useState([])
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [errorDetails, setErrorDetails] = useState(null)
  
  useEffect(() => {
    if (!selectedSongId) {
      setSongDetails(null)
      return
    }
    const fetchDetails = async () => {
      setLoadingDetails(true)
      try {
        const details = await getSongDetails(selectedSongId)
        setSongDetails(details)
      } catch (err) {
        setErrorDetails('Failed to load song details')
      } finally {
        setLoadingDetails(false)
      }
    }
    fetchDetails()
  }, [selectedSongId])

  useEffect(() => {
    if (!songDetails?.artistId) {
      setQueueItems([]);
      return;
    }
    const fetchQueueItems = async () => {
      const items = await QueueApi(songDetails.artistId, selectedSongId);
      setQueueItems(items);
    };
    fetchQueueItems();
  }, [songDetails, selectedSongId]);

  const handleSongEnd = () => {
    if (queueItems.length > 0) {
      const nextSong = queueItems[0];
      setSelectedSongId(nextSong.id);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 overflow-x-hidden">
      <div className="w-full max-w-[1100px] bg-zinc-900 rounded-xl p-4 md:p-8 shadow-2xl overflow-hidden">
        {/* Top section with search on left and queue on right */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          {/* Search bar on left */}
          <div className="w-full md:w-1/3">
            <Searchbox onSongSelect={setSelectedSongId} />
          </div>
          
          {/* Queue on right */}
          <div className="w-full md:w-1/3">
            {songDetails?.artistId && selectedSongId && (
              <QueueUI artistId={songDetails.artistId} currentSongId={selectedSongId} />
            )}
          </div>
        </div>
        
        {/* Main content section */}
        <div className="w-full mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-start">
            {/* Left column: Banner and SongData */}
            <div className="flex flex-col items-center">
              <div className="w-48 sm:w-64 md:w-80">
                <Banner songId={selectedSongId} />
              </div>
              <div className="w-48 sm:w-64 md:w-80 bg-transparent backdrop-blur-md rounded p-1">
                <SongData songId={selectedSongId} />
              </div>
            </div>
            {/* Right column: Lyrics panel */}
            <div className="w-full max-w-md p-4 h-80 overflow-y-auto">
              <LyricApi song={songDetails?.title} artist={songDetails?.artist} />
            </div>
          </div>
        </div>
        
        {/* Controls centered at bottom */}
        <div className="w-full mb-4">
          <Songcontrol songId={selectedSongId} onSongEnd={handleSongEnd} />
        </div>
      </div>
    </div>
  )
}

export default Main
