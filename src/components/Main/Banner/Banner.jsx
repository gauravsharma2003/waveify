import React, { useState, useEffect } from 'react'
import { getSongDetails } from '../../Main/Api'
import Blur from './Blur'

function Banner({ songId }) {
  const [songDetails, setSongDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [displayImageUrl, setDisplayImageUrl] = useState(null)
  const [nextImageUrl, setNextImageUrl] = useState(null)
  const [imageLoading, setImageLoading] = useState(false)

  useEffect(() => {
    const fetchSongDetails = async () => {
      if (!songId) return
      setLoading(true)
      setError(null)
      try {
        const details = await getSongDetails(songId)
        setSongDetails(details)
      } catch (err) {
        console.error('Error fetching song details:', err)
        // setError('Failed to load song details')
      } finally {
        setLoading(false)
      }
    }
    fetchSongDetails()
  }, [songId])

  useEffect(() => {
    const newUrl = songDetails?.imageUrl
    if (!newUrl) return
    if (!displayImageUrl) {
      setDisplayImageUrl(newUrl)
    } else if (newUrl !== displayImageUrl) {
      setNextImageUrl(newUrl)
      setImageLoading(true)
    }
  }, [songDetails?.imageUrl])
  useEffect(() => {
    if (nextImageUrl && imageLoading) {
      const imgPreload = new Image()
      imgPreload.src = nextImageUrl
      imgPreload.onload = () => {
        setDisplayImageUrl(nextImageUrl)
        setNextImageUrl(null)
        setImageLoading(false)
      }
      imgPreload.onerror = () => {
        setDisplayImageUrl(nextImageUrl)
        setNextImageUrl(null)
        setImageLoading(false)
      }
    }
  }, [nextImageUrl, imageLoading])

  if (!songId) {
    return (
      <div className="w-full relative flex justify-center items-center pt-4 pb-0">
        <Blur imageUrl={displayImageUrl} />
        <div className="w-full max-w-[500px] h-auto aspect-square bg-zinc-950 rounded-lg relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-zinc-600 text-lg md:text-xl px-4 text-center">CMND/CTRL + K to search</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !songDetails) {
    return (
      <div className="w-full relative flex justify-center items-center pt-4 pb-0">
        <Blur imageUrl={displayImageUrl} />
      </div>
    )
  }

  return (
    <div className="w-full relative flex flex-col items-center pt-4 pb-0">
      {/* Flare background */}
      <Blur imageUrl={displayImageUrl} />

      <div className="w-full max-w-[500px] h-auto aspect-square bg-zinc-950 rounded-lg shadow-xl relative">
        <div className="absolute inset-0 m-[1px] rounded-lg overflow-hidden">
          {displayImageUrl ? (
            <img
              src={displayImageUrl}
              alt={songDetails.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/500x500?text=No+Image'; }}
            />
          ) : (
            <div className="w-full h-full bg-zinc-950" />
          )}
        </div>
        {imageLoading && (
          <div className="absolute inset-0 w-full h-full animate-shimmer bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 rounded-lg" />
        )}
      </div>
    </div>
  )
}

export default Banner
