import React, { useState, useEffect } from 'react'
import { getSongDetails } from '../Api'

function SongData({ songId }) {
  const [songDetails, setSongDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSongDetails = async () => {
      if (!songId) return
      setLoading(true)
      setError(null)
      try {
        const details = await getSongDetails(songId)
        setSongDetails(details)
      } catch (err) {
        console.error('Error fetching song data:', err)
        setError('Failed to load song data')
      } finally {
        setLoading(false)
      }
    }
    fetchSongDetails()
  }, [songId])

  if (!songId) return null
  if (loading) return <p className="text-center text-zinc-400"></p>
  if (error) return <p className="text-center text-red-500">{error}</p>
  if (!songDetails) return null

  return (
    <div className="text-center mt-4">
      <h1 className="text-white text-4xl md:text-6xl font-extrabold">{songDetails?.title}</h1>
      <p className="text-zinc-300 text-lg md:text-lg mt-2">{songDetails?.artist}</p>
    </div>
  )
}

export default SongData
