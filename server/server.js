// src/server.js
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "https://music-playlist-visualizer.vercel.app/callback";

// step 1: exchange code for tokens
app.post("/exchange_token", async (req, res) => {
    const { code, code_verifier } = req.body;

    try {
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", REDIRECT_URI);
        params.append("client_id", CLIENT_ID);
        params.append("code_verifier", code_verifier);

        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            params,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        
        res.json(response.data);
    }   catch(error) {
        console.error("Token exchange failed: ", error.respons?.data || error.message);
        res.status(400).json({ error: "Failed to exchange token" });
    }
});

// step 2: refresh token endpoint
app.post("/refresh_token", async (req, res) => {
    const { refresh_token } = req.body;

    try {
        const params = new URLSearchParams();
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", refresh_token);
        params.append("client_id", CLIENT_ID);

        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            params,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        res.json(response.data);
    }   catch(error) {
        console.error("Token refresh failed", error.response?.data || error.message);
        res.status(400).json({ error: "Failed to refresh token" });
    }
});
const PORT = 8888;
app.listen(PORT, () => {
    console.log(`server listening on http://127.0.0.1:${PORT}`);
}); 

export default app;
