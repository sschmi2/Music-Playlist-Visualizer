import './App.css';
import PlaylistManager from './PlaylistManager';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Callback from "./Callback";

function App() {
  const token = localStorage.getItem("spotifyAccessToken");

  return (
    <Router>
      <Routes>
        {/* if logged in, show playlist manager, else redirect to login */}
        <Route path="/" element={token ? <PlaylistManager /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;
