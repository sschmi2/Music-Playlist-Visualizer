import React, { useState } from 'react';

function AddSongForm({ onAddSong }) {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [rating, setRating] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title && artist && rating) {
            onAddSong({
                id: Date.now(), // simple id for now
                title,
                artist,
                rating: parseFloat(rating)
            });
            // clear form
            setTitle('');
            setArtist('');
            setRating('');
        }
    };

    return (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', textAlign: 'center' }}>
            <h3>Add New Song</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Song Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ margin: '5px', padding: '8px' }}
                />
                <input
                    type="text"
                    placeholder="Artist"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    style={{ margin: '5px', padding: '8px' }}
                />
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="Rating (0-10)"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    style={{ margin: '5px', padding: '8px' }}
                />
                <button type="submit" style={{ margin: '5px', padding: '8px 15px' }}>
                    Add Song
                </button>
            </form>
        </div>
    )
}

export default AddSongForm;