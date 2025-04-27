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
  
  useEffect(() => {
    if (songDetails && songDetails.artistId) {
      if (!queueFetched.current) {
        fetchQueue(songDetails.artistId);
      }
    } else {
      queueFetched.current = false;
    }
  }, [songDetails?.artistId]);
  
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
      const nextSong = queueItems.find(song => !playedSongs.includes(song.id));
      if (nextSong) {
        setSelectedSongId(nextSong.id);
      }
    }
  };

  const handleQueueSongSelect = (songId) => {
    if (songId === selectedSongId) return;
    setSelectedSongId(songId);
  };

  useEffect(() => {
    console.log("Queue items in Main:", queueItems.length);
  }, [queueItems]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-zinc-950 to-zinc-900 flex flex-col overflow-hidden">
      <div className="w-full bg-zinc-900/80 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-30 border-b border-zinc-800">
        <div className="w-full max-w-md">
          <Searchbox onSongSelect={setSelectedSongId} />
        </div>
        

        <div className="flex-shrink-0 ml-4">
          {queueItems.length > 0 && (
            <div className="relative">
              <QueueUI 
                queueItems={queueItems} 
                currentSongId={selectedSongId} 
                onSongSelect={handleQueueSongSelect}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="w-full max-w-4xl mx-auto">
          {!selectedSongId ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <p className="text-lg">Search for a song to start listening</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-5 justify-center">
      
              <div className="flex flex-col items-center lg:w-1/2 mx-auto">
                <div className="w-full max-w-sm h-auto">
                  <Banner songId={selectedSongId} />
                </div>
                <div className="w-full text-center mt-4">
                  <SongData songId={selectedSongId} />
                </div>
              </div>
              
      
              <div className="mx-auto mt-6  lg:mt-6">
                <div className="bg-zinc-800/40 backdrop-blur-sm rounded-lg p-5 shadow-lg w-full max-w-sm h-[350px] overflow-y-auto">
                  <h2 className="text-xl text-white font-semibold mb-16">Lyrics</h2>
                  <div className="lyrics-container">
                    <LyricApi song={songDetails?.title} artist={songDetails?.artist} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full bg-zinc-900/50 backdrop-blur-lg border-t border-zinc-800 p-4 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto">
          <Songcontrol songId={selectedSongId} onSongEnd={handleSongEnd} />
        </div>
      </div>
    </div>
  )
}

export default Main
