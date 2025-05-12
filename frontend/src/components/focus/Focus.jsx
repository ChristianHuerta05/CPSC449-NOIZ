import React, { useState, useEffect, useRef } from "react";
import { usePlayer } from "../PlayerContext";
import "./Focus.css";

export default function Focus() {
  const { currentTrack } = usePlayer();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [lyrics, setLyrics] = useState(["Loading lyrics…"]);
  const [colors, setColors] = useState(["#111", "#333"]);

  useEffect(() => {
    if (!currentTrack) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = currentTrack.album.images[0]?.url;
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      let r = 0,
        g = 0,
        b = 0,
        ctr = 0;
      for (let i = 0; i < data.length; i += 4 * 50) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        ctr++;
      }
      r = Math.round(r / ctr);
      g = Math.round(g / ctr);
      b = Math.round(b / ctr);

      const c1 = `rgb(${r},${g},${b})`;
      const c2 = `rgb(${Math.max(r - 30, 0)},${Math.max(g - 30, 0)},${Math.max(b - 30, 0)})`;
      setColors([c1, c2]);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (!currentTrack) return setLyrics(["No lyrics available"]);
    const a = currentTrack.artists[0]?.name;
    const t = currentTrack.name;
    fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(a)}/${encodeURIComponent(t)}`
    )
      .then((r) => r.json())
      .then((j) => setLyrics(j.lyrics?.split("\n") || ["No lyrics found."]))
      .catch(() => setLyrics(["Lyrics unavailable."]));
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setTime(audio.currentTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
    };
  }, [currentTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (e) => {
    audioRef.current.currentTime = e.target.value;
    setTime(e.target.value);
  };

  const changeVol = (e) => {
    audioRef.current.volume = e.target.value;
    setVolume(e.target.value);
  };

  const fmt = (n) => {
    const m = Math.floor(n / 60),
      s = Math.floor(n % 60)
        .toString()
        .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      className="FocusPage-container"
      style={{
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
      }}
    >
      <div className="FocusPage-main">
        <div className="FocusPage-left">
          {currentTrack ? (
            <img
              src={currentTrack.album.images[0]?.url}
              alt={currentTrack.name}
              className="FocusPage-art"
            />
          ) : (
            <div className="FocusPage-artPlaceholder" />
          )}
        </div>

        <div className="FocusPage-right">
          <h2 className="FocusPage-trackTitle">
            {currentTrack?.name || "No track selected"}
          </h2>
          <h3 className="FocusPage-trackArtist">
            {currentTrack?.artists.map((a) => a.name).join(", ")}
          </h3>
          <div className="FocusPage-lyrics">
            {lyrics.map((line, i) => (
              <p key={i}>{line || "\u00A0"}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="FocusPage-controls">
        <audio
          ref={audioRef}
          src={currentTrack?.preview_url}
          crossOrigin="anonymous"
        />
        <button onClick={togglePlay} className="FocusPage-btn">
          {isPlaying ? "⏸" : "▶️"}
        </button>
        <span className="FocusPage-time">{fmt(time)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.01"
          value={time}
          onChange={seek}
          className="FocusPage-seek"
        />
        <span className="FocusPage-time">-{fmt(duration - time)}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={changeVol}
          className="FocusPage-volume"
        />
      </div>
    </div>
  );
}
