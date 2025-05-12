import React from "react";
import { useNavigate } from "react-router-dom";

const friendsData = {
  1: {
    id: 1,
    name: "Mark",
    profileImage: "/cats/pfp1.jpg",
    isOnline: true,
  },
  2: {
    id: 2,
    name: "Chris",
    profileImage: "/cats/pfp2.jpg",
    isOnline: true,
  },
  3: {
    id: 3,
    name: "Pillow",
    profileImage: "/cats/pfp3.jpg",
    isOnline: false,
  },
  4: {
    id: 4,
    name: "Tanisha",
    profileImage: "/cats/pfp4.jpg",
    isOnline: false,
  },
  5: {
    id: 5,
    name: "Elzie",
    profileImage: "/cats/pfp5.jpg",
    isOnline: false,
  },
};

export default function FriendsMenu() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#121212",
        color: "#FFFFFF",
        minWidth: "100vw",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>Your Friends</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 16,
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {Object.values(friendsData).map((friend) => (
          <div
            key={friend.id}
            onClick={() => navigate(`/friends/${friend.id}`)}
            style={{
              cursor: "pointer",
              background: "#1E1E1E",
              borderRadius: 12,
              padding: 16,
              textAlign: "center",
              transition: "transform 0.1s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div style={{ position: "relative", marginBottom: 12 }}>
              <img
                src={friend.profileImage}
                alt={friend.name}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: friend.isOnline ? "#1DB954" : "#888",
                  border: "2px solid #121212",
                  bottom: 4,
                  right: 4,
                }}
              />
            </div>
            <div style={{ fontSize: "1rem", fontWeight: "500" }}>
              {friend.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
