// api/exchange-token.js
import axios from "axios";

export const config = {
  api: {
    bodyParser: true, // ensure Vercel parses JSON body
  },
};

export default async function handler(req, res) {
  console.log("Handler called with method:", req.method);

  if (req.method === "GET") {
    return res.json({
      message: "exchange_token endpoint is working",
      method: req.method,
      timestamp: new Date().toISOString(),
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

    console.log("Token exchange success");
    res.json(response.data);
  } catch (error) {
    console.error(
      "Token exchange failed. Full error object:",
      error.toJSON ? error.toJSON() : error
    );
    res.status(500).json({
      error: "Failed to exchange token",
      details: error.response?.data || error.message,
    });
  }
}
