import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlayer } from "../PlayerContext";
import { getArtist, getArtistTracks, getArtistAlbums } from "../utils/api";
import "./ArtistPage.css";

function ArtistPage() {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const { setCurrentTrack } = usePlayer();

  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const artistData = await getArtist(artistId);
        setArtist(artistData);

        const { tracks } = await getArtistTracks(artistId);
        setTopTracks(tracks);

        const { items } = await getArtistAlbums(artistId);
        setAlbums(items);
      } catch (err) {
        console.error("Spotify API Error:", err);
        navigate("/connect-spotify");
      }
    })();
  }, [artistId, navigate]);

  if (!artist) {
    return <div className="ArtistPage-container">Loading artist data...</div>;
  }

  return (
    <div className="ArtistPage-container">
      <button
        className="ArtistPage-backButton"
        onClick={() => navigate("/home")}
      >
        ← Back
      </button>

      <div className="ArtistPage-header">
        <img
          src={artist.images[0]?.url}
          alt={artist.name}
          className="ArtistPage-headerImage"
        />
        <div className="ArtistPage-headerOverlay">
          <h1 className="ArtistPage-artistName">{artist.name}</h1>
          <p className="ArtistPage-artistFollowers">
            {artist.followers.total.toLocaleString()} Followers
          </p>
          <div className="ArtistPage-genres">
            {artist.genres.map((g) => (
              <span key={g} className="ArtistPage-genreTag">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="ArtistPage-content">
        <section className="ArtistPage-section">
          <h2 className="ArtistPage-sectionTitle">Top Tracks</h2>
          <ul className="ArtistPage-songList">
            {topTracks.slice(0, 5).map((track) => (
              <li
                key={track.id}
                className="ArtistPage-songItem clickable"
                onClick={() => setCurrentTrack({ uri: track.uri, ...track })}
              >
                <img
                  src={track.album.images[0]?.url}
                  alt={track.name}
                  className="ArtistPage-songImage"
                />
                <div className="ArtistPage-songDetails">
                  <span className="ArtistPage-songTitle">{track.name}</span>
                  <br />
                  <span className="ArtistPage-songAlbum">
                    {track.album.name}
                  </span>
                </div>
                <span className="ArtistPage-songDuration">
                  {formatDuration(track.duration_ms)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ArtistPage-section">
          <h2 className="ArtistPage-sectionTitle">Albums</h2>
          <div className="ArtistPage-albumGrid">
            {albums.slice(0, 8).map((album) => (
              <div key={album.id} className="ArtistPage-albumCover">
                <img
                  src={album.images[0]?.url}
                  alt={album.name}
                  className="ArtistPage-albumImage"
                />
                <h4 className="ArtistPage-albumTitle">{album.name}</h4>
                <p className="ArtistPage-albumDate">
                  {album.release_date.slice(0, 4)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function formatDuration(ms) {
  const min = Math.floor(ms / 60000);
  const sec = String(Math.round((ms % 60000) / 1000)).padStart(2, "0");
  return `${min}:${sec}`;
}

export default ArtistPage;
