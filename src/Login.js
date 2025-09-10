// src/Login.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { generateCodeVerifier, generateCodeChallenge } from "./pkceUtils";

const CLIENT_ID = "8b0a8581c4bb4ec1a70a9b140ac17399"; // copy from Spotify dashboard
const REDIRECT_URI = "https://music-playlist-visualizer.vercel.app/callback";  // must match in dashboard
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"; 
const SCOPES = [
    "user-read-email",
    "playlist-read-private",
    "user-read-private"
];

function Login() {
    const navigate = useNavigate();

    const handleLogin = async () => {
        const codeVerifier = generateCodeVerifier();
        sessionStorage.setItem("code_verifier", codeVerifier);

        const codeChallenge = await generateCodeChallenge(codeVerifier);
    
        const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
            REDIRECT_URI
        )}&response_type=code&scope=${SCOPES.join(" ")}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

        window.location.href = loginUrl;  // go to spotify
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Login with Spotify</h2>
            <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: "16px" }}>
                Login to Spotify
            </button>
        </div>
    );
}

export default Login;
