import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        return res.json({ 
            message: "exchange_token endpoint is working", 
            method: req.method,
            timestamp: new Date().toISOString()
        }); 
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code, code_verifier } = req.body;
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
    const REDIRECT_URI = "https://music-playlist-visualizer.vercel.app/callback";

    try {
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", REDIRECT_URI);
        params.append("client_id", CLIENT_ID);
        params.append("client_secret", CLIENT_SECRET);
        params.append("code_verifier", code_verifier);

        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            params,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        
        res.json(response.data);
    } catch(error) {
        console.error("Token exchange failed: ", error.response?.data || error.message);
        res.status(400).json({ error: "Failed to exchange token" });
    }
}