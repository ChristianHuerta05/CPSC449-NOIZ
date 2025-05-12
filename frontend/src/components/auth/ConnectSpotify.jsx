import React from "react";

export default function ConnectSpotify() {
  const handleConnect = () => {
    window.location.href = "/api/spotify/login";
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        minWidth: "100vw",
        margin: 0,
        background:
          "radial-gradient(circle at top left, #1ed760 0%, #121212 100%)",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        color: "#fff",
      }}
    >
      <div
        style={{
          background: "#181818",
          borderRadius: 16,
          padding: "40px 24px",
          maxWidth: 360,
          width: "100%",
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <svg
            role="img"
            height="48"
            viewBox="0 0 168 168"
            width="48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Spotify</title>
            <circle cx="84" cy="84" fill="#1ED760" r="84" />
            <path
              d="M123.5 111.8c-3.3 5.4-10.4 7-15.8 3.6-21.7-13.3-49-16.3-80.9-9.1-6.3 1.4-12.7-2.2-14.1-8.5-1.4-6.3 2.2-12.7 8.5-14.1 36.9-8.5 68 0 93.3 12 5.6 3.4 7.2 10.5 3.6 15.9z"
              fill="#fff"
            />
            <path
              d="M130.4 88.1c-2.6 4.2-8.2 5.5-12.4 2.9-17.4-10.8-40.2-13.2-66.3-7.3-5.1 1.3-10.5-1.8-11.8-7-1.3-5.1 1.8-10.5 7-11.8 30.5-7.8 57.2-4.2 78.6 8.2 4.2 2.6 5.5 8.2 2.9 12z"
              fill="#fff"
            />
            <path
              d="M132.7 64.6c-18.3-11-48.7-12-67.2-6.7-3.7 1.2-7.7-0.7-8.9-4.4-1.2-3.7 0.7-7.7 4.4-8.9 22.7-7.3 57.3-5.8 78.6 7.6 3.6 2.1 4.7 6.7 2.6 10.3-2.1 3.6-6.7 4.7-10.3 2.1z"
              fill="#fff"
            />
          </svg>
        </div>

        <h2 style={{ margin: "0 0 12px", fontSize: "1.75rem" }}>
          Connect to Spotify
        </h2>
        <p style={{ margin: "0 0 28px", color: "#B3B3B3", lineHeight: 1.4 }}>
          Link your Spotify account to start streaming music and controlling
          playback right from Noiz.
        </p>

        <button
          onClick={handleConnect}
          style={{
            background: "linear-gradient(90deg, #1DB954, #1ed760)",
            border: "none",
            borderRadius: 24,
            padding: "14px 32px",
            fontSize: "1rem",
            fontWeight: "600",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            transition:
              "transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
          }}
        >
          Connect with Spotify
        </button>
      </div>
    </div>
  );
}
