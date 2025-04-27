import axios from 'axios';

/**
 * @param {string} artistId 
 * @param {string} currentSongId 
 * @returns {Promise<Array<{id: string, name: string, artist: string, image: string}>>} 
 */
async function QueueApi(artistId, currentSongId) {
  if (!artistId) return [];
  try {
    const artistRes = await axios.get(`https://saavn.dev/api/artists/${artistId}/songs`);
    const songsArray = artistRes.data.data?.songs || [];
    return songsArray
      .filter(song => song.id !== currentSongId)
      .map(song => ({
        id: song.id,
        name: song.name,
        artist: song.artists?.primary?.[0]?.name || '',
        image: song.image?.[2]?.url || '' 
      }));
  } catch (error) {
    console.error('Error fetching queue for artist', artistId, error);
    return [];
  }
}

export default QueueApi;
