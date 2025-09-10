// src/Callback.js 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Callback() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("Processing...");

    useEffect(() => {
        // Check if we already have tokens (successful previous attempt)
        if (localStorage.getItem("spotifyAccessToken")) {
            console.log("Already have tokens, redirecting...");
            navigate("/");
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        console.log("Callback component loaded");
        console.log("Authorization code:", code);

        if (!code) {
            setError("No authorization code found in URL");
            return;
        }

        const codeVerifier = sessionStorage.getItem("code_verifier");
        console.log("Code verifier from sessionStorage:", codeVerifier);

        if (!codeVerifier) {
            // If no code verifier but we have a code, user might have refreshed
            // or this is a second execution - redirect to login to start over
            console.log("No code verifier found - redirecting to login");
            navigate("/login");
            return;
        }

        setStatus("Exchanging authorization code for access token...");
        
        axios.post("https://music-playlist-visualizer.vercel.app/exchange_token", {
            code,
            code_verifier: codeVerifier,
        })
        .then((response) => {
            console.log("✅ Token exchange successful!");
            
            const { access_token, refresh_token, expires_in } = response.data;
            const expiryTime = new Date().getTime() + expires_in * 1000;

            // Store tokens
            localStorage.setItem("spotifyAccessToken", access_token);
            localStorage.setItem("spotifyRefreshToken", refresh_token);
            localStorage.setItem("spotifyTokenExpiry", expiryTime);

            // Clear session storage
            sessionStorage.removeItem("code_verifier");
            
            console.log("Tokens stored, redirecting to home...");
            navigate("/");
        })
        .catch((err) => {
            console.error("❌ Token exchange failed:", err.response?.data || err.message);
            
            // Clear session storage on error
            sessionStorage.removeItem("code_verifier");
            
            setError("Authentication failed. Please try logging in again.");
            
            // Auto-redirect to login after 3 seconds
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        });
    }, [navigate]);

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ color: 'red' }}>Error: {error}</p>
                <p>Redirecting to login page...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>🎵 Connecting to Spotify...</p>
            <p>{status}</p>
        </div>
    );
}

export default Callback;