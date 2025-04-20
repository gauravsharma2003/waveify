import React, { useState, useEffect, useRef } from 'react'
import { getSongDetails } from '../Api'
import PlayPause from './Playpause/PlayPause'
import Seekbar from './Seekbar/Seekbar'

function Songcontrol({ songId }) {
  const [songDetails, setSongDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const fetchDetails = async () => {
      if (!songId) return
      setLoading(true)
      setError(null)
      try {
        const details = await getSongDetails(songId)
        setSongDetails(details)
      } catch (err) {
        console.error('Error loading song details for control', err)
        setError('Failed to load song details')
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [songId])

  useEffect(() => {
    if (songDetails?.songUrl && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = songDetails.songUrl
      audioRef.current.load()
      audioRef.current.play()
      setIsPlaying(true)
      setCurrentTime(0)
    }
  }, [songDetails])

  const handleToggle = (play) => {
    if (!audioRef.current) return
    setIsPlaying(play)
    play ? audioRef.current.play() : audioRef.current.pause()
  }

  const handleSeek = (time) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  if (!songId) return null
  if (loading) return <p className="text-center text-zinc-400"></p>
  if (error) return <p className="text-center text-red-500">{error}</p>
  if (!songDetails) return null

  return (
    <div className="flex flex-col items-center space-y-1">
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        className="hidden"
      />
      <PlayPause isPlaying={isPlaying} onToggle={handleToggle} />
      <Seekbar duration={songDetails.duration} initialTime={currentTime} onSeek={handleSeek} />
    </div>
  )
}

export default Songcontrol
