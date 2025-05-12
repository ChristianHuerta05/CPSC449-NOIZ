import React, { useEffect, useState } from "react";
import { getSpotifyToken } from "../utils/api";
import "./Profile.css";

export default function Profile() {
  const [me, setMe] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        const { access_token } = await getSpotifyToken();
        const headers = { Authorization: `Bearer ${access_token}` };

        const meRes = await fetch("https://api.spotify.com/v1/me", { headers });
        const meData = await meRes.json();

        const plRes = await fetch(
          "https://api.spotify.com/v1/me/playlists?limit=8",
          { headers }
        );
        const plData = await plRes.json();
        const taRes = await fetch(
          "https://api.spotify.com/v1/me/top/artists?limit=8",
          { headers }
        );
        const taData = await taRes.json();

        if (!isMounted) return;
        setMe(meData);
        setPlaylists(plData.items ?? []);
        setTopArtists(taData.items ?? []);
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (!isMounted) return;
        setPlaylists([]);
        setTopArtists([]);
      }
    }

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!me) {
    return <div className="profile-loading">Loading your profile…</div>;
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <img
          src={me.images?.[0]?.url || "/placeholder-avatar.png"}
          alt={me.display_name}
          className="profile-avatar"
        />
        <div className="profile-userinfo">
          <h1 className="profile-name">{me.display_name}</h1>
          <p className="profile-email">{me.email}</p>
          <div className="profile-stats">
            <div>
              <strong>{me.followers?.total?.toLocaleString() ?? 0}</strong>
              <span> Followers</span>
            </div>
            <div>
              <strong>{me.product || "Free"}</strong>
              <span> Plan</span>
            </div>
          </div>
        </div>
      </header>

      <section className="profile-section">
        <h2>Your Playlists</h2>
        <div className="card-grid">
          {(playlists || []).map((pl) => (
            <div key={pl.id} className="card">
              <img
                src={pl.images?.[0]?.url || "/placeholder-playlist.png"}
                alt={pl.name}
                className="card-image"
              />
              <h3 className="card-title">{pl.name}</h3>
              <p className="card-sub">
                {pl.tracks?.total ?? 0}{" "}
                {(pl.tracks?.total ?? 0) === 1 ? "track" : "tracks"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="profile-section">
        <h2>Top Artists</h2>
        <div className="card-grid">
          {(topArtists || []).map((ar) => (
            <div key={ar.id} className="card">
              <img
                src={ar.images?.[0]?.url || "/placeholder-artist.png"}
                alt={ar.name}
                className="card-image"
              />
              <h3 className="card-title">{ar.name}</h3>
              <p className="card-sub">
                {(ar.followers?.total ?? 0).toLocaleString()} followers
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
