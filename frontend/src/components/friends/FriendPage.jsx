import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FriendPage.css";

const friendsData = {
  1: {
    id: 1,
    name: "Mark",
    profileImage: "/cats/pfp1.jpg",
    favoriteSongs: ["Still Into You", "Misery Business", "Ignorance"],
    playlists: ["Roadtrip Mix", "Morning Chill", "Workout Hits"],
    artistId: "74XFHRwlV6OrjEM0A2NCMF",
  },
  2: {
    id: 2,
    name: "Chris",
    profileImage: "/cats/pfp2.jpg",
    favoriteSongs: ["hey now", "Tv Off", "All The Stars"],
    playlists: ["Study Focus", "Indie Jams"],
    artistId: "2YZyLoL8N0Wb9xBt1NhZWg",
  },
  3: {
    id: 3,
    name: "Pillow",
    profileImage: "/cats/pfp3.jpg",
    favoriteSongs: ["Die With A Smile", "Treasure", "That's What I like"],
    playlists: ["Relaxing Piano", "Evening Acoustic"],
    artistId: "0du5cEVh5yTK9QJze8zA0C",
  },
  4: {
    id: 4,
    name: "Tanisha",
    profileImage: "/cats/pfp4.jpg",
    favoriteSongs: ["Blinding Lights", "Starboy", "Timeless"],
    playlists: ["Night Drive", "Party Mode"],
    artistId: "1Xyo4u8uXC1ZmMpatF05PJ",
  },
  5: {
    id: 5,
    name: "Elzie",
    profileImage: "/cats/pfp5.jpg",
    favoriteSongs: ["My Way", "Fly Me To The Moon", "That's Life"],
    playlists: ["Taylor Essentials", "Pop Hits"],
    artistId: "1Mxqyy3pSjf8kZZL4QVxS0",
  },
};

const FriendPage = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const friend = friendsData[friendId];

  if (!friend) {
    return <div className="FriendPage-container">Friend not found.</div>;
  }

  const handleSongClick = () => {
    navigate(`/artist/${friend.artistId}`);
  };

  return (
    <div className="FriendPage-container">
      <button
        className="FriendPage-backButton"
        onClick={() => navigate("/home")}
      >
        ← Back
      </button>

      <div className="FriendPage-profileSection">
        <img
          src={friend.profileImage}
          alt={friend.name}
          className="FriendPage-profileImage"
        />
        <h1 className="FriendPage-friendName">{friend.name}</h1>
      </div>

      <div className="FriendPage-infoSection">
        <section className="FriendPage-section">
          <h2>Favorite Songs</h2>
          <ul>
            {friend.favoriteSongs.map((song, idx) => (
              <li
                key={`song-${idx}`}
                className="FriendPage-clickableSong"
                onClick={handleSongClick}
              >
                {song}
              </li>
            ))}
          </ul>
        </section>

        <section className="FriendPage-section">
          <h2>Playlists</h2>
          <ul>
            {friend.playlists.map((playlist, idx) => (
              <li key={`playlist-${idx}`}>{playlist}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default FriendPage;
