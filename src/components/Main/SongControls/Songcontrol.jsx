import React from 'react'
import PlayPause from './Playpause/PlayPause'
import Seekbar from './Seekbar/Seekbar'

function Songcontrol() {
  return (
    <div className="flex flex-col items-center space-y-1">
      <PlayPause />
      <Seekbar />
    </div>
  )
}

export default Songcontrol
