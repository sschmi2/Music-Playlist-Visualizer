// generate a random string for code verifier
export const generateCodeVerifier = () => {
    const array = new Uint8Array(64);  
    window.crypto.getRandomValues(array);
    
    // That gives you a 64-char random verifier using the allowed PKCE characters.
    return Array.from(array)
    .map(num => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"[num % 66])
    .join("");
};


// encode string to base64url
const base64UrlEncode = (str) => {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

// generate a code challenge from the verifier
export const generateCodeChallenge = async (verifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return base64UrlEncode(digest);
};