import styles from "./styles/HomeBody.module.css";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/api";

const albumsArray = [
  "https://storage.googleapis.com/noiz-assets/album1.png",
  "https://storage.googleapis.com/noiz-assets/album2.png",
  "https://storage.googleapis.com/noiz-assets/album4.png",
];
const albumsUrl = [
  "artist/5INjqkS1o8h1imAzPqGZBb",
  "artist/3TVXtAsR1Inumwj472S9r4",
  "artist/7gW0r5CkdEUMm42w9XpyZO",
];
const friendsArray = [
  { id: 1, name: "Mark", image: "/cats/pfp1.jpg", isOnline: true },
  { id: 2, name: "Chris", image: "/cats/pfp2.jpg", isOnline: true },
  { id: 3, name: "Pillow", image: "/cats/pfp3.jpg", isOnline: false },
  { id: 4, name: "Tanisha", image: "/cats/pfp4.jpg", isOnline: false },
  { id: 5, name: "Elzie", image: "/cats/pfp5.jpg", isOnline: false },
];

const HomeBody = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Hello");
  const [firstName, setFirstName] = useState("Guest");

  useEffect(() => {
    getUser()
      .then(({ first_name }) => {
        if (first_name) setFirstName(first_name);
      })
      .catch(() => {
        console.warn("Could not fetch user profile");
      });

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleFriendClick = (friendId) => {
    navigate(`/friends/${friendId}`);
  };
  const onFocusModeClick = () => {
    navigate("/focus-mode");
  };

  const handleAlbumClick = (index) => {
    navigate(`/${albumsUrl[index]}`);
  };

  return (
    <div className={styles.homeBodyContainer}>
      <h1>
        {greeting} {firstName}
      </h1>

      <h2>Recently Played</h2>
      <div className={styles.recentlyPlayedContainer}>
        {albumsArray.map((album, index) => (
          <div
            className={styles.albumContainer}
            key={index}
            onClick={() => handleAlbumClick(index)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={album}
              alt={`Album ${index + 1}`}
              style={{ borderRadius: "20px" }}
            />
            <div className={styles.albumInfoContainer}>
              <h3>Album {index + 1}</h3>
            </div>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "200px",
            height: "200px",
            backgroundColor: "#373737",
            borderRadius: "20px",
            justifyContent: "center",
            alignItems: "center",
            color: "#DCDCDC",
            fontWeight: "500",
          }}
        >
          <FontAwesomeIcon
            icon={faPlus}
            style={{ color: "#DCDCDC", fontSize: "52px" }}
          />
          Create Playlist
        </div>
      </div>

      <h2>Friends</h2>
      <div className={styles.friendsContainer}>
        {friendsArray.map((friend, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "12px",
              gap: "5px",
              cursor: "pointer",
            }}
            onClick={() => handleFriendClick(friend.id)}
          >
            <div className={styles.friendElement}>
              {friend.isOnline && (
                <div className={styles.onlineIndicator}></div>
              )}
              <img
                src={friend.image}
                alt={friend.name}
                className={styles.friendImage}
              />
            </div>
            <div className={styles.friendName}>{friend.name}</div>
          </div>
        ))}
      </div>

      <h2>Quick Actions</h2>
      <div className={styles.quickActionsContainer}>
        <div onClick={onFocusModeClick}>
          <h4>Focus Mode</h4>
          <p>
            Immerse yourself in a distraction-free listening experience with
            specially curated tracks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeBody;
