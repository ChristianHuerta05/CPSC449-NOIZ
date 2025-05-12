import React, { useEffect, useRef, useState } from "react";
import { usePlayer } from "../PlayerContext";
import {
  getSpotifyToken,
  playTracks,
  getPlaylists,
  addSongToPlaylist,
  createPlaylist,
} from "../utils/api";
import {
  faPlay,
  faPause,
  faVolumeDown,
  faVolumeUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Player() {
  const playerRef = useRef(null);
  const { currentTrack } = usePlayer();

  const [deviceId, setDeviceId] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const [playlists, setPlaylists] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "noiz Player",
        getOAuthToken: (cb) => {
          getSpotifyToken().then((d) => cb(d.access_token));
        },
        volume,
      });

      player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) return;
        setIsPaused(state.paused);
        setPosition(state.position);
        setDuration(state.track_window.current_track.duration_ms);
      });

      player.addListener("initialization_error", ({ message }) =>
        console.error("Init Error:", message)
      );
      player.addListener("authentication_error", ({ message }) =>
        console.error("Auth Error:", message)
      );
      player.addListener("playback_error", ({ message }) =>
        console.error("Playback Error:", message)
      );

      player.connect();
      playerRef.current = player;
    };

    return () => {
      playerRef.current?.disconnect();
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    getPlaylists().then(setPlaylists).catch(console.error);
  }, []);

  useEffect(() => {
    if (deviceId && currentTrack?.uri) {
      playTracks(deviceId, [currentTrack.uri]).catch(console.error);
    }
  }, [deviceId, currentTrack]);

  useEffect(() => {
    let iv;
    if (!isPaused && playerRef.current) {
      iv = setInterval(async () => {
        const st = await playerRef.current.getCurrentState();
        if (st) {
          setPosition(st.position);
          setDuration(st.track_window.current_track.duration_ms);
        }
      }, 1000);
    }
    return () => clearInterval(iv);
  }, [isPaused]);

  const togglePlayPause = () =>
    playerRef.current?.togglePlay().catch(console.error);

  const onVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    playerRef.current?.setVolume(v).catch(console.error);
  };

  const formatTime = (ms) => {
    const sec = Math.floor(ms / 1000),
      m = Math.floor(sec / 60),
      s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const onAdd = async (pl) => {
    if (!currentTrack) return;
    try {
      await addSongToPlaylist(pl._id, currentTrack);
      alert(`Added to “${pl.name}”`);
      setShowMenu(false);
    } catch (e) {
      console.error(e);
    }
  };

  const onCreate = async () => {
    if (!newName.trim()) return;
    try {
      const pl = await createPlaylist(newName.trim());
      setPlaylists([...playlists, pl]);
      setNewName("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#181818",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.5)",
        zIndex: 10000,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {currentTrack ? (
          <>
            <img
              src={currentTrack.album.images[0]?.url}
              alt={currentTrack.name}
              style={{ width: 56, height: 56, borderRadius: 4 }}
            />
            <div style={{ color: "#fff" }}>
              <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                {currentTrack.name}
              </div>
              <div style={{ fontSize: "0.875rem", color: "#B3B3B3" }}>
                {currentTrack.artists.map((a) => a.name).join(", ")}
              </div>
            </div>
          </>
        ) : (
          <div style={{ color: "#B3B3B3" }}>Select a song to play</div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={togglePlayPause}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            background: isPaused ? "#1DB954" : "#444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <FontAwesomeIcon
            icon={isPaused ? faPlay : faPause}
            style={{ color: "#FFF", fontSize: "1.25rem" }}
          />
        </button>
        <span style={{ color: "#B3B3B3", fontSize: "0.9rem" }}>
          {formatTime(position)} / {formatTime(duration)}
        </span>
      </div>

      <div style={{ position: "relative" }}>
        <button
          onClick={() => setShowMenu((v) => !v)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon
            icon={faPlus}
            style={{ color: "#fff", fontSize: "1.2rem" }}
          />
        </button>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              right: 0,
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: 4,
              padding: 8,
              width: 200,
              zIndex: 10001,
            }}
          >
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                maxHeight: 180,
                overflowY: "auto",
              }}
            >
              {playlists.map((pl) => (
                <li
                  key={pl._id}
                  onClick={() => onAdd(pl)}
                  style={{
                    padding: "6px 8px",
                    cursor: "pointer",
                    borderBottom: "1px solid #444",
                  }}
                >
                  {pl.name}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", marginTop: 8 }}>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New playlist"
                style={{
                  flex: 1,
                  padding: "4px 6px",
                  borderRadius: 4,
                  border: "1px solid #444",
                  background: "#111",
                  color: "#fff",
                }}
              />
              <button
                onClick={onCreate}
                style={{
                  marginLeft: 4,
                  padding: "4px 6px",
                  borderRadius: 4,
                  border: "none",
                  background: "#1DB954",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <FontAwesomeIcon icon={faVolumeDown} style={{ color: "#B3B3B3" }} />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={onVolumeChange}
          style={{
            width: 100,
            accentColor: "#1DB954",
            cursor: "pointer",
          }}
        />
        <FontAwesomeIcon icon={faVolumeUp} style={{ color: "#B3B3B3" }} />
      </div>
    </div>
  );
}
