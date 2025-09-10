// src/PlaylistManager.js
import AddSongForm from './AddSongForm';
import BinaryTreeViz from './BinaryTreeViz';
import MaxHeap from './MaxHeap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PlaylistManager() {
    const navigate = useNavigate();
    const [songs, setSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const addSong = (newSong) => {
        setSongs(prevSongs => [...prevSongs, newSong]);
    };

    // helper: clear tokens + redirect
    const clearTokensAndRedirect = () => {
        localStorage.removeItem("spotifyAccessToken");
        localStorage.removeItem("spotifyRefreshToken");
        localStorage.removeItem("spotifyTokenExpiry");
        navigate('/login');
    };

    useEffect(() => {
        const fetchPlaylists = async () => {
            const token = localStorage.getItem("spotifyAccessToken");
            if (!token) return clearTokensAndRedirect();

            try {
                setLoading(true);
                
                const res = await fetch("https://api.spotify.com/v1/me/playlists", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.status === 401) return clearTokensAndRedirect();
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();
                // Check if we got a valid response
                if (data.error) throw new Error(data.error.message || 'Spotify API error');
                
                // Store playlists in state
                setPlaylists(data.items || []);
                setError(null);

            } catch (err) {
                console.error("Error fetching playlists:", err);
                setError("Failed to fetch playlists.");
                clearTokensAndRedirect();

            } finally {
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, [navigate, clearTokensAndRedirect]);

    // UPDATED: Now fetches ALL tracks with pagination support
    const fetchPlaylistTracks = async (playlistId) => {
        const token = localStorage.getItem("spotifyAccessToken");
        if (!token) return clearTokensAndRedirect();

        try {
            setLoading(true);
            let allTracks = [];
            let offset = 0;
            const limit = 100; // Max allowed by Spotify API
            
            // Keep fetching until we get all tracks
            while (true) {
                const res = await fetch(
                    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
                    {
                        headers: { 
                            Authorization: `Bearer ${token}` 
                        }
                    }
                );

                if (res.status === 401) return clearTokensAndRedirect();
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();
                
                // Add this batch of tracks to our collection
                allTracks.push(...data.items);
                
                // Check if there are more tracks to fetch
                if (data.items.length < limit || data.next === null) {
                    break; // We've got all the tracks
                }
                
                // Move to the next batch
                offset += limit;
                
                // Optional: Add a small delay to be respectful to Spotify's API
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Map all tracks to your song structure
            const spotifySongs = allTracks
                .filter(item => item.track && item.track.id) // Filter out null tracks
                .map(item => ({
                    id: item.track.id,
                    title: item.track.name,
                    artist: item.track.artists[0]?.name || 'Unknown Artist',
                    rating: item.track.popularity / 10  // normalize 0-10
                }));

            console.log(`Fetched ${spotifySongs.length} tracks from playlist`); // Debug log
            setSongs(spotifySongs);
            setError(null);

        } catch (err) {
            console.error("Error fetching tracks:", err);
            setError("Failed to fetch playlist tracks.");
        } finally {
            setLoading(false);
        }
    };

    // Create heap only if we have songs
    const heap = songs.length > 0 ? new MaxHeap(songs) : null;
    const heapArray = heap ? heap.getHeapArray() : [];

    if (loading && playlists.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Music Playlist Visualizer</h1>
                <p>Loading your Spotify playlists...</p>
            </div>
        );
    }

    return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20, marginTop: 40 }}>
      <h1>Music Playlist Visualizer</h1>

      {/* Playlist selector */}
      <div style={{ marginBottom: 20 }}>
        <h3>Select a Spotify Playlist:</h3>
        <select
          value={selectedPlaylistId || ""}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedPlaylistId(id);
            if (id) fetchPlaylistTracks(id);
          }}
          style={{ padding: 8, minWidth: 250 }}
        >
          <option value="">-- Choose a playlist --</option>
          {playlists.map(pl => (
            <option key={pl.id} value={pl.id}>{pl.name} ({pl.tracks.total} tracks)</option>
          ))}
        </select>
      </div>

      {/* Loading indicator for tracks */}
      {loading && selectedPlaylistId && (
        <div style={{ marginBottom: 20, padding: 10, backgroundColor: '#f0f8ff', borderRadius: 4 }}>
          <p>Loading playlist tracks... This may take a moment for large playlists.</p>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div style={{ marginBottom: 20, padding: 10, backgroundColor: '#ffe6e6', borderRadius: 4, color: '#d00' }}>
          <p>{error}</p>
        </div>
      )}

      {/* Row: Add Song (left) | Songs List (right) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',     // top-align the two columns
          gap: 20,
          width: '100%',
          maxWidth: 1100,
          marginTop: 20,
          marginBottom: 40,
        }}
      >

        {/* Songs List */}
        <div style={{ flex: 1 }}>
          <h2 style={{ marginTop: 0 }}>Songs List ({songs.length} songs)</h2>
          <div
            style={{
              width: '100%',
              height: 400,
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: 10,
              maxWidth: 850
            }}
          >
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {songs.map(song => (
                <li
                  key={song.id}
                  style={{
                    padding: '6px 0',
                    borderBottom: '1px solid #eee',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={`${song.title} — ${song.artist}`}
                >
                  <strong>{song.title}</strong> by {song.artist} — Rating: {song.rating.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Add Song Form */}
            <div style={{ width: 300, flexShrink: 0, marginTop: 105, marginLeft: 40 }}>
            <AddSongForm onAddSong={addSong} />
            </div>
      </div>

      {/* Heap Visualization (below the row) */}
      <div style={{ width: '100%', textAlign: 'center' }}>
        <h2 style={{ textAlign: 'center' }}>Max Heap Visualization</h2>
        <BinaryTreeViz songs={heapArray} />
      </div>
    </div>
  );
}

export default PlaylistManager;