import React, { useState, useEffect } from 'react'
import Searchbox from '../Search/Searchbox'
import Banner from './Banner/Banner'
import Songcontrol from './SongControls/Songcontrol'
import SongData from './SongData/SongData'
import LyricApi from './Lyrics/LyricApi'
import { getSongDetails } from './Api'

function Main() {
  const [selectedSongId, setSelectedSongId] = useState(null)
  const [songDetails, setSongDetails] = useState(null)
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

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 overflow-x-hidden">
      <div className="w-full max-w-[1100px] bg-zinc-900 rounded-xl p-4 md:p-8 shadow-2xl overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md mb-6">
            <Searchbox onSongSelect={setSelectedSongId} />
          </div>
          
          {/* Two-column layout: cover + metadata on left, lyrics on right */}
          <div className="self-start pl-4 mb-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-center">
              {/* Left column: Banner and SongData */}
              <div className="flex flex-col items-center ">
                <div className="w-48 sm:w-64 md:w-80">
                  <Banner songId={selectedSongId} />
                </div>
                <div className="w-48 sm:w-64 md:w-80 bg-transparent backdrop-blur-md  rounded p-1">
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
            <Songcontrol songId={selectedSongId} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
