import React, { useEffect, useState } from "react";
import { getSpotifyMe } from "../utils/api";

export default function SpotifyAccountInfo() {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getSpotifyMe()
      .then((data) => setInfo(data))
      .catch((_) => setError("Please connect your Spotify account."));
  }, []);

  if (error) return <div className="spotify-account-info-error">{error}</div>;
  if (!info) return <div>Loading account info...</div>;

  return (
    <div className="spotify-account-info">
      <h2>Spotify Account Info</h2>
      {info.images?.[0] && (
        <img
          src={info.images[0].url}
          alt="Profile"
          style={{ width: 100, borderRadius: "50%" }}
        />
      )}
      <p>
        <strong>Name:</strong> {info.display_name}
      </p>
      <p>
        <strong>Email:</strong> {info.email}
      </p>
      <p>
        <strong>Followers:</strong> {info.followers.total}
      </p>
    </div>
  );
}
