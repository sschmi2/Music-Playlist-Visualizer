// api/exchange-token.js
const axios = require("axios");

// Use module.exports instead of export
module.exports = async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log("Handler called with method:", req.method);
  console.log("Environment check:", {
    hasClientId: !!process.env.SPOTIFY_CLIENT_ID,
    hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
  });

  if (req.method === "GET") {
    return res.json({
      message: "exchange_token endpoint is working",
      method: req.method,
      timestamp: new Date().toISOString(),
      env_status: {
        hasClientId: !!process.env.SPOTIFY_CLIENT_ID,
        hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
      }
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, code_verifier } = req.body;

  if (!code || !code_verifier) {
    console.error("Missing code or code_verifier in request body");
    return res.status(400).json({ error: "Missing code or code_verifier" });
  }

  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const REDIRECT_URI = "https://music-playlist-visualizer.vercel.app/callback";

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error("Spotify environment variables missing");
    return res.status(500).json({ error: "Missing Spotify environment variables" });
  }

  try {
    console.log("Attempting token exchange with Spotify...");
    
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
      { 
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded" 
        }
      }
    );

    console.log("Token exchange success");
    return res.json(response.data);

  } catch (error) {
    console.error("Token exchange failed:", error.message);
    console.error("Error response:", error.response?.data);
    
    return res.status(500).json({
      error: "Failed to exchange token",
      details: error.response?.data || error.message,
    });
  }
};