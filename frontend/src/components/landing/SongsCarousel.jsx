import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faStepBackward,
  faStepForward,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

const SongsCarousel = () => {
  const [isDisabledMove, setIsDisabledMove] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const totalTime = 227;

  const [songs, setSongs] = useState([
    { name: "Eventually", artist: "Tame Impala" },
    { name: "9", artist: "Drake" },
    { name: "Borderline", artist: "Tame Impala" },
    { name: "Falling Behind", artist: "Laufey" },
  ]);

  const [transformations, setTransformations] = useState([
    {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "500px",
      zIndex: 5,
      transform: "translate(-50%, -50%)",
    },
    {
      position: "absolute",
      top: "50%",
      left: "calc(50% + 225px)",
      width: "450px",
      zIndex: 4,
      transform: "translate(-50%, -50%)",
    },
    {
      position: "absolute",
      top: "50%",
      left: "calc(50% + 225px + 200px)",
      width: "400px",
      zIndex: 3,
      transform: "translate(-50%, -50%)",
    },
    {
      position: "absolute",
      top: "50%",
      left: "calc(20%)",
      width: "350px",
      zIndex: 2,
      transform: "translate(-50%, -50%)",
      opacity: 0,
    },
  ]);

  const move = () => {
    setIsDisabledMove(true);
    setTransformations((prev) => {
      const lastElement = prev[prev.length - 1];
      return [lastElement, ...prev.slice(0, prev.length - 1)];
    });
    setSongs((prev) => {
      const firstElement = prev[0];
      return [...prev.slice(1), firstElement];
    });

    setCurrentTime(0);
    setTimeout(() => {
      setIsDisabledMove(false);
    }, 500);
  };

  const moveBack = () => {
    setIsDisabledMove(true);
    setTransformations((prev) => {
      const firstElement = prev[0];
      return [...prev.slice(1), firstElement];
    });
    setSongs((prev) => {
      const lastElement = prev[prev.length - 1];
      return [lastElement, ...prev.slice(0, prev.length - 1)];
    });

    setCurrentTime(0);
    setTimeout(() => {
      setIsDisabledMove(false);
    }, 500);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime < totalTime) {
            return prevTime + 1;
          } else {
            clearInterval(intervalId);
            return prevTime;
          }
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, totalTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const progressPercent = (currentTime / totalTime) * 100;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className="songs-carousel">
        <div className="songs-carousel-text">
          <h2 style={{ fontSize: "36px" }}>
            All your favorite artists in one <br /> place
          </h2>
          <p style={{ fontSize: "18px", color: "#D3D3D3" }}>
            Discover a curated universe where every beat, exclusive release,
            <br /> and behind-the-scenes moment from the artists you love is
            right
            <br /> at your fingertips.
          </p>
        </div>
        <div className="carousel-landing">
          <img
            src="https://storage.googleapis.com/noiz-assets/album1.png"
            style={transformations[0]}
            className="carousel-animation"
            alt="Album 1"
          />
          <img
            src="https://storage.googleapis.com/noiz-assets/album2.png"
            style={transformations[1]}
            className="carousel-animation"
            alt="Album 2"
          />
          <img
            src="https://storage.googleapis.com/noiz-assets/album3.png"
            style={transformations[2]}
            className="carousel-animation"
            alt="Album 3"
          />
          <img
            src="https://storage.googleapis.com/noiz-assets/album4.png"
            style={transformations[3]}
            className="carousel-animation"
            alt="Album 4"
          />
        </div>
      </div>
      <div className="songs-carousel-controller">
        <div style={{ fontSize: "45px" }}>{songs[0].name}</div>
        <div style={{ fontSize: "20px", color: "#D3D3D3", opacity: 0.7 }}>
          {songs[0].artist}
        </div>
        <div
          style={{
            width: "400px",
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "10px",
              backgroundColor: "#ccc",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                backgroundColor: "#007bff",
                transition: "width 0.1s linear",
              }}
            ></div>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              marginTop: "5px",
              fontSize: "14px",
            }}
          >
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalTime)}</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "400px",
            marginTop: "20px",
            marginBottom: "60px",
          }}
        >
          <button
            className="carousel-button"
            onClick={moveBack}
            disabled={isDisabledMove}
          >
            <FontAwesomeIcon icon={faStepBackward} size="4x" />
          </button>
          <button
            className="carousel-button"
            onClick={togglePlayPause}
            disabled={isDisabledMove}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="4x" />
          </button>
          <button
            className="carousel-button"
            onClick={move}
            disabled={isDisabledMove}
          >
            <FontAwesomeIcon icon={faStepForward} size="4x" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongsCarousel;
