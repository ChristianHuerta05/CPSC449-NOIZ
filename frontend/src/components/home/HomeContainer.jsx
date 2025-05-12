import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import HomeBody from "./HomeBody";
import { checkSpotifyStatus, searchArtists } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./HomeContainer.css";

export default function HomeContainer() {
  const navigate = useNavigate();
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    checkSpotifyStatus()
      .then(({ connected }) => setSpotifyConnected(connected))
      .catch(() => setSpotifyConnected(false));
  }, []);

  useEffect(() => {
    if (!spotifyConnected || !query.trim()) {
      setResults([]);
      return;
    }
    const debounce = setTimeout(() => {
      searchArtists(query)
        .then((data) => setResults(data.artists.items))
        .catch(console.error);
    }, 500);
    return () => clearTimeout(debounce);
  }, [query, spotifyConnected]);

  if (!spotifyConnected) {
    return (
      <div className="main-container-home">
        <SideNav />
        <div className="home-not-connected">
          <button onClick={() => navigate("/connect-spotify")}>
            Connect Spotify to get started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container-home">
      <div className="home-left-section-container">
        <SideNav />
      </div>
      <div className="home-right-section-container">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search music, artists, albums…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />

          {results.length > 0 && (
            <div className="search-dropdown">
              {results.map((artist) => (
                <div
                  key={artist.id}
                  className="search-item"
                  onClick={() => {
                    navigate(`/artist/${artist.id}`);
                    setQuery("");
                    setResults([]);
                  }}
                >
                  <img
                    src={artist.images[0]?.url}
                    alt={artist.name}
                    className="search-item-img"
                  />
                  <span className="search-item-name">{artist.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <HomeBody />
      </div>
    </div>
  );
}
