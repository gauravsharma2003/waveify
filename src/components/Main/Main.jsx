import React from 'react'
import Searchbox from '../Search/Searchbox'
import Banner from './Banner/Banner'
import { useState } from 'react'
import Songcontrol from './SongControls/Songcontrol'
function Main() {
  const [selectedSongId, setSelectedSongId] = useState(null)
  
  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 overflow-x-hidden">
      <div className="w-full max-w-[1100px] bg-zinc-900 rounded-xl p-4 md:p-8 shadow-2xl overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md mb-6">
            <Searchbox onSongSelect={setSelectedSongId} />
          </div>
          
          <div className="self-start pl-4 mb-8">
            <div className="w-48 sm:w-64 md:w-80">
              <Banner songId={selectedSongId} />
              <Songcontrol />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
