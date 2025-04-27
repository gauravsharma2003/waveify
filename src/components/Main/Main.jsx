import React, { useState, useEffect, useRef } from 'react'
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
  const [playedSongs, setPlayedSongs] = useState([])
  const queueFetched = useRef(false)
  
  // Reset queue fetch flag when artistId changes
  useEffect(() => {
    if (songDetails && songDetails.artistId) {
      if (!queueFetched.current) {
        fetchQueue(songDetails.artistId);
      }
    } else {
      queueFetched.current = false;
    }
  }, [songDetails?.artistId]);
  
  // Fetch queue data
  const fetchQueue = async (artistId) => {
    if (!artistId || !selectedSongId) return;
    
    try {
      console.log("Fetching queue for artist: ", artistId);
      const items = await QueueApi(artistId, selectedSongId);
      setQueueItems(items);
      queueFetched.current = true;
      console.log("Queue items fetched:", items.length);
    } catch (err) {
      console.error("Error fetching queue: ", err);
    }
  };
  
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
        
        // Add current song to played songs history
        setPlayedSongs(prev => [...prev, selectedSongId])
      } catch (err) {
        setErrorDetails('Failed to load song details')
      } finally {
        setLoadingDetails(false)
      }
    }
    fetchDetails()
  }, [selectedSongId])

  const handleSongEnd = () => {
    if (queueItems.length > 0) {
      // Find the first song in the queue that hasn't been played yet
      const nextSong = queueItems.find(song => !playedSongs.includes(song.id));
      if (nextSong) {
        setSelectedSongId(nextSong.id);
      }
    }
  };

  // Handle song selection from queue
  const handleQueueSongSelect = (songId) => {
    if (songId === selectedSongId) return; // Don't reselect current song
    setSelectedSongId(songId);
  };

  // Debug helper
  useEffect(() => {
    console.log("Queue items in Main:", queueItems.length);
  }, [queueItems]);

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 overflow-x-hidden">
      <div className="w-full max-w-[1100px] bg-zinc-900 rounded-xl p-4 md:p-8 shadow-2xl overflow-hidden relative">
        {/* Queue UI in top right - ensure z-index is high enough */}
        <div className="absolute top-4 right-4 w-96 z-20">
          {queueItems.length > 0 && (
            <QueueUI 
              queueItems={queueItems} 
              currentSongId={selectedSongId} 
              onSongSelect={handleQueueSongSelect}
            />
          )}
        </div>
        
        {/* Top section with search on left */}
        <div className="mb-6">
          {/* Search bar */}
          <div className="w-full max-w-md">
            <Searchbox onSongSelect={setSelectedSongId} />
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
            
            {/* Right column: Lyrics */}
            <div className="flex flex-col space-y-6">
              {/* Lyrics panel */}
              <div className="w-full p-10 h-60 overflow-y-auto">
                <LyricApi song={songDetails?.title} artist={songDetails?.artist} />
              </div>
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
