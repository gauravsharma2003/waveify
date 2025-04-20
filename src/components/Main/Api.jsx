import React, { useState } from 'react'
import axios from 'axios'

export const searchSongs = async (query) => {
  try {
    const response = await axios.get(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}&limit=3`);
    
    if (response.data.success) {
      // Extract first 3 songs from results
      const songs = response.data.data.results.slice(0, 3).map(song => ({
        id: song.id,
        title: song.name,
        // split names containing &amp; into separate artists
        artist: song.artists.primary
          .flatMap(a => a.name.split('&amp;').map(n => n.trim()))
          .join(', '),
        imageUrl: song.image.find(img => img.quality === "150x150")?.url || song.image[0]?.url,

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
      
      const highestDownload = song.downloadUrl.reduce((prev, curr) => {
        const prevQ = parseInt(prev.quality, 10);
        const currQ = parseInt(curr.quality, 10);
        return currQ > prevQ ? curr : prev;
      }, song.downloadUrl[0]);
      console.log(highestDownload)
      
      return {
        id: song.id,
        title: song.name,
        artist: song.artists.primary
          .flatMap(a => a.name.split('&amp;').map(n => n.trim()))
          .join(', '),
        imageUrl: highestResImage.url,
        duration: song.duration,
        album: song.album.name,
        songUrl: highestDownload.url
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