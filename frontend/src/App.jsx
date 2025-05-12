import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Landing from "./components/landing/Landing";
import HomeContainer from "./components/home/HomeContainer";
import Profile from "./components/profile/Profile";
import FocusPage from "./components/focus/Focus";
import SpotifyConnect from "./components/auth/ConnectSpotify";
import SignUp from "./components/auth/SignUp";
import LogIn from "./components/auth/LogIn";
import ArtistPage from "./components/artistpage/ArtistPage";
import FriendPage from "./components/friends/FriendPage";
import Player from "./components/home/Player";
import { PlayerProvider } from "./components/PlayerContext";
import { AuthProvider } from "./components/auth/AuthContext";
import FriendsMenu from "./components/friends/FriendsMenu";
import Playlist from "./components/playlist/Playlist";

const AppContent = () => {
  const location = useLocation();
  const hidePlayerRoutes = ["/", "/signup", "/login", "/connect-spotify"];
  const shouldShowPlayer = !hidePlayerRoutes.includes(
    location.pathname.toLowerCase()
  );

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<HomeContainer />} />
        <Route path="/playlists" element={<Playlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/focus-mode" element={<FocusPage />} />
        <Route path="/connect-spotify" element={<SpotifyConnect />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/artist/:artistId" element={<ArtistPage />} />
        <Route path="/friends/:friendId" element={<FriendPage />} />
        <Route path="/friends-menu" element={<FriendsMenu />} />
      </Routes>
      {shouldShowPlayer && <Player />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <PlayerProvider>
          <AppContent />
        </PlayerProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
