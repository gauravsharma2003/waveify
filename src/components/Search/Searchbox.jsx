import React, { useState, useEffect, useRef } from 'react'
import { searchSongs } from '../Main/Api'
import Dropdown from './Dropdown'

function Searchbox({ onSongSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleSearch = async () => {
      if (query.trim() === '') {
        setResults([])
        return
      }
      
      setIsLoading(true)
      try {
        const songs = await searchSongs(query)
        setResults(songs)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      handleSearch()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSongSelect = (songId) => {
    if (onSongSelect) {
      onSongSelect(songId)
      setShowDropdown(false)
    }
  }

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full bg-zinc-950 text-white rounded-lg px-4 py-2 pr-10 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-700"
          placeholder="Search for songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin"></div>
          ) : (
            <svg 
              className="h-5 w-5 text-zinc-500" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
        </div>
      </div>
      
      {showDropdown && query.trim() !== '' && (
        <Dropdown 
          results={results} 
          isLoading={isLoading} 
          onSongSelect={handleSongSelect}
        />
      )}
    </div>
  )
}

export default Searchbox
