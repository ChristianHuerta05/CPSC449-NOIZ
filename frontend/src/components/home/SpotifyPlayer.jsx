import React, { useEffect, useRef, useState } from "react";
import { getSpotifyToken, playTracks } from "../utils/api";

export default function SpotifyPlayer({ uri }) {
  const playerRef = useRef(null);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "noiz Player",
        getOAuthToken: (cb) => {
          getSpotifyToken().then((data) => cb(data.access_token));
        },
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
      });

      player.connect();
      playerRef.current = player;
    };

    return () => {
      document.body.removeChild(script);
      playerRef.current?.disconnect();
    };
  }, []);

  const startPlayback = () => {
    if (!deviceId) return;
    playTracks({ deviceId, uris: [uri] }).catch(console.error);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={startPlayback}>Play Track</button>
      <button onClick={() => playerRef.current?.togglePlay()}>
        Toggle Play/Pause
      </button>
    </div>
  );
}
