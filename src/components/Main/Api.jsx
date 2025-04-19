import React, { useState } from 'react'
import axios from 'axios'

export const searchSongs = async (query) => {
  try {
    const response = await axios.get(`https://saavn.dev/api/search?query=${encodeURIComponent(query)}`);
    
    if (response.data.success) {
      // Extract first 3 songs from results
      const songs = response.data.data.songs.results.slice(0, 3).map(song => ({
        id: song.id,
        title: song.title,
        artist: song.primaryArtists,
        imageUrl: song.image.find(img => img.quality === "150x150")?.url || song.image[0]?.url
      }));
      
      return songs;
    }
    return [];
  } catch (error) {
    console.error("Error searching songs:", error);
    return [];
  }
};

export const getSongDetails = async (id) => {
  try {
    const response = await axios.get(`https://saavn.dev/api/songs/${id}`);
    
    if (response.data.success && response.data.data.length > 0) {
      const song = response.data.data[0];
      // Get the highest resolution image
      const highestResImage = song.image.reduce((prev, current) => {
        const prevQuality = parseInt(prev.quality.split('x')[0]);
        const currentQuality = parseInt(current.quality.split('x')[0]);
        return currentQuality > prevQuality ? current : prev;
      }, song.image[0]);
      
      return {
        id: song.id,
        title: song.name,
        artist: song.artists.primary.map(artist => artist.name).join(', '),
        imageUrl: highestResImage.url,
        duration: song.duration,
        album: song.album.name,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching song details:", error);
    return null;
  }
};

function Api() {
  return (
    <div>
      <h2>Music API Component</h2>
      <p>This component exports functions for searching songs and getting song details.</p>
    </div>
  )
}

export default Api
