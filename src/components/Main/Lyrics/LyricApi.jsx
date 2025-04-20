import React, { useState, useEffect, useRef, useMemo } from 'react'
import axios from 'axios'
import { Music } from 'lucide-react'

function LyricApi({ song, artist }) {
  const [lyricData, setLyricData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const listRef = useRef(null)

  useEffect(() => {
    if (!song || !artist) return
    const fetchLyrics = async () => {
      setLoading(true)
      setError(null)
      try {
        const query = encodeURIComponent(`${song} ${artist}`)
        const response = await axios.get(`https://lrclib.net/api/search?q=${query}`)
        let items = response.data || []
        // pick best result or fallback
        let best = items.find(item => item.syncedLyrics) || items[0] || null
        // if nothing found, retry search by song title only
        if (!best) {
          const fallbackQuery = encodeURIComponent(song)
          const fallbackResponse = await axios.get(`https://lrclib.net/api/search?q=${fallbackQuery}`)
          const fallbackItems = fallbackResponse.data || []
          // try exact title match (case-insensitive)
          const exactMatch = fallbackItems.find(item => item.title?.toLowerCase() === song.toLowerCase())
          best = exactMatch || fallbackItems.find(item => item.syncedLyrics) || fallbackItems[0] || null
        }
        setLyricData(best)
      } catch (err) {
        console.error('Error fetching lyrics API:', err)
        setError('Failed to fetch lyric search results')
      } finally {
        setLoading(false)
      }
    }
    fetchLyrics()
  }, [song, artist])

  useEffect(() => {
    if (lyricData?.syncedLyrics) {
      const audioEl = document.querySelector('audio')
      if (!audioEl) return
      const handler = () => setCurrentTime(audioEl.currentTime)
      audioEl.addEventListener('timeupdate', handler)
      return () => audioEl.removeEventListener('timeupdate', handler)
    }
  }, [lyricData])

  const lines = useMemo(() => {
    if (!lyricData?.syncedLyrics) return []
    return lyricData.syncedLyrics.split('\n').map(raw => {
      const m = raw.match(/\[(\d{2}):(\d{2}(?:\.\d{2})?)\](.*)/)
      if (m) {
        const time = parseInt(m[1],10)*60 + parseFloat(m[2])
        return { time, text: m[3] }
      }
      return null
    }).filter(Boolean)
  }, [lyricData])
  const activeIndex = useMemo(() => {
    let idx = 0
    lines.forEach((ln, i) => { if (currentTime >= ln.time) idx = i })
    return idx
  }, [currentTime, lines])
  useEffect(() => {
    if (listRef.current && lines.length) {
      const el = listRef.current.querySelector(`[data-index="${activeIndex}"]`)
      if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [activeIndex, lines])

  if (!song || !artist) return null
  if (loading) return <p className="text-center text-zinc-400"></p>
  if (error) return <p className="text-center text-red-500">{error}</p>
  if (!lyricData) return <p className="text-center text-lg text-zinc-200">Seems like there are no lyrics for this song :/</p>

  if (lines.length > 0) {
    return (
      <div ref={listRef} className="space-y-2 text-center overflow-y-auto h-40 text-lg md:text-3xl">
        {lines.map((ln, i) => {
          const isActive = i === activeIndex
          const isBefore = i < activeIndex
          const isAfter = i > activeIndex
          const isPrev = i === activeIndex - 1
          const isNext = i === activeIndex + 1
          let classList = 'transition-colors duration-200 whitespace-pre-wrap '
          if (isActive) {
            classList += 'text-white font-bold opacity-100'
          } else if (isBefore) {
            classList += isPrev ? 'text-white opacity-50' : 'text-white opacity-25'
          } else {
            classList += isNext ? 'text-zinc-500 opacity-50' : 'text-zinc-500 opacity-25'
          }
          return (
            <p key={i} data-index={i} className={classList}>
              {ln.text?.trim() ? ln.text : <Music className="inline-block w-5 h-5 text-white" />}
            </p>
          )
        })}
      </div>
    )
  }

  return (
    <pre className="whitespace-pre-wrap text-lg text-center text-zinc-300 h-48 overflow-y-auto">
      {lyricData.plainLyrics}
    </pre>
  )
}

export default LyricApi
