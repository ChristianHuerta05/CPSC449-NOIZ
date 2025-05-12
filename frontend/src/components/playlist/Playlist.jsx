import React, { useState, useEffect } from "react";
import { getPlaylists, createPlaylist } from "../utils/api";
import { usePlayer } from "../PlayerContext";
import "./Playlists.css";

export default function Playlists() {
  const { setCurrentTrack } = usePlayer();
  const [playlists, setPlaylists] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    getPlaylists().then(setPlaylists).catch(console.error);
  }, []);

  const selected = playlists.find((p) => p._id === selectedId);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const pl = await createPlaylist(newName.trim());
      setPlaylists((p) => [...p, pl]);
      setNewName("");
      setSelectedId(pl._id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="Playlists-container">
      <aside className="Playlists-sidebar">
        <h2>Your Playlists</h2>
        <ul>
          {playlists.map((pl) => (
            <li
              key={pl._id}
              className={pl._id === selectedId ? "active" : ""}
              onClick={() => setSelectedId(pl._id)}
            >
              {pl.name}
            </li>
          ))}
        </ul>

        <div className="Playlists-new">
          <input
            type="text"
            placeholder="New playlist name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={handleCreate}>Create</button>
        </div>
      </aside>

      <main className="Playlists-main">
        <div className="Playlists-main-header">
          <h2>{selected ? selected.name : "Select a playlist"}</h2>
          <button className="Playlists-main-create" onClick={handleCreate}>
            + Make Playlist
          </button>
        </div>

        {selected ? (
          selected.songs.length > 0 ? (
            <ul className="Playlists-songs">
              {selected.songs.map((t, i) => (
                <li key={i} onClick={() => setCurrentTrack(t)}>
                  <img src={t.album.images[0]?.url} alt={t.name} />
                  <div>
                    <div className="song-title">{t.name}</div>
                    <div className="song-artists">{t.artists.join(", ")}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No songs in this playlist yet.</p>
          )
        ) : (
          <p>Select a playlist to view its songs.</p>
        )}
      </main>
    </div>
  );
}
