import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../PlayerContext";
import styles from "./styles/SideNav.module.css";

export default function SideNav() {
  const navigate = useNavigate();
  const { currentTrack } = usePlayer();
  const [bgColor, setBgColor] = useState("#4f4e4e");
  const [lyrics, setLyrics] = useState("Select a song to see lyrics here…");

  useEffect(() => {
    if (!currentTrack) {
      setBgColor("#4f4e4e");
      setLyrics("Select a song to see lyrics here…");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = currentTrack.album.images[0]?.url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let r = 0,
        g = 0,
        b = 0,
        count = 0;
      for (let i = 0; i < data.length; i += 4 * 20) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      setBgColor(`rgb(${r},${g},${b})`);
    };

    (async () => {
      const artist = currentTrack.artists[0]?.name || "";
      const title = currentTrack.name || "";
      try {
        const res = await fetch(
          `https://api.lyrics.ovh/v1/${encodeURIComponent(
            artist
          )}/${encodeURIComponent(title)}`
        );
        const json = await res.json();
        if (json.lyrics) {
          setLyrics(json.lyrics);
        } else {
          setLyrics("No lyrics found.");
        }
      } catch {
        setLyrics("Lyrics unavailable.");
      }
    })();
  }, [currentTrack]);

  const navItems = [
    {
      name: "Dashboard",
      icon: "https://storage.googleapis.com/noiz-assets/box.svg",
      route: "/home",
    },
    {
      name: "Playlists",
      icon: "https://storage.googleapis.com/noiz-assets/music.svg",
      route: "/playlists",
    },

    {
      name: "Friends",
      icon: "https://storage.googleapis.com/noiz-assets/friends.svg",
      route: "/friends-menu",
    },
    {
      name: "Focus Mode",
      icon: "https://storage.googleapis.com/noiz-assets/headphones.svg",
      route: "/focus-mode",
    },
    {
      name: "Your Profile",
      icon: "https://storage.googleapis.com/noiz-assets/user.svg",
      route: "/profile",
    },
  ];
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", bgColor);
  }, [bgColor]);
  return (
    <div className={styles.sideNavHomeContainer}>
      <div className={styles.homeSideNavTopContainer}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "35px",
            fontWeight: "900",
          }}
        >
          <img
            src="/LOGO.svg"
            alt="Logo"
            style={{ width: 70, marginBottom: 16 }}
          />
          NOIZ
        </div>

        <ul className={styles.homeSideNavList}>
          {navItems.map((item, i) => (
            <li key={i}>
              <button onClick={() => navigate(item.route)}>
                <img
                  src={item.icon}
                  alt={item.name}
                  style={{ marginRight: 8, height: 20 }}
                />
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div
        className={styles.homeSideNavBottomContainer}
        style={{ backgroundColor: bgColor }}
      >
        {currentTrack?.album?.images[0]?.url ? (
          <img
            src={currentTrack.album.images[0].url}
            alt="Now Playing"
            style={{ width: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 180,
              backgroundColor: "#333",
            }}
          />
        )}
        <div className={styles.sideButton} />

        <div className={styles.homeSideNavLyrics}>
          {lyrics.split("\n").map((line, idx) => (
            <p key={idx} style={{ margin: "4px 0", color: "#fff" }}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
