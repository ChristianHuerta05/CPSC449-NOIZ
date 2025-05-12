import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieSession from "cookie-session";
import bcrypt from "bcrypt";
import { Connector } from "@google-cloud/cloud-sql-connector";
import mysql from "mysql2/promise";
import path from "path";
import crypto from "crypto";
import querystring from "querystring";
import fetch from "node-fetch";
import dayjs from "dayjs";
import mongoose from "mongoose";

const {
  MONGODB_URI,
  COOKIE_SESSION_KEYS,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} = process.env;

const app = express();
const port = parseInt(process.env.PORT, 10) || 8080;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const playlistSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  name: { type: String, required: true },
  songs: [
    {
      uri: String,
      name: String,
      artists: [String],
      album: {
        name: String,
        images: [{ url: String }],
      },
    },
  ],
});
const Playlist = mongoose.model("Playlist", playlistSchema);

app.set("trust proxy", 1);
app.use(
  cookieSession({
    name: "session",
    keys: COOKIE_SESSION_KEYS.split(","),
    maxAge: 3600_000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const staticPath = path.join(process.cwd(), "dist");
app.use(express.static(staticPath));

const connector = new Connector();

async function createPool() {
  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
  });
  return mysql.createPool({
    ...clientOpts,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
  });
}

const poolPromise = createPool();
async function findUserByEmail(email) {
  const pool = await poolPromise;
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
}

app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields required." });
  }
  try {
    if (await findUserByEmail(email))
      return res.status(409).json({ error: "User already exists." });

    const hash = await bcrypt.hash(password, 12);
    const pool = await poolPromise;
    const [result] = await pool.query(
      `INSERT INTO users 
         (first_name, last_name, email, password_hash) 
       VALUES (?, ?, ?, ?)`,
      [firstName, lastName, email, hash]
    );

    req.session.userId = result.insertId;
    res.status(201).json({ message: "User created.", userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error." });
  }
});

app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials." });

    req.session.userId = user.id;
    res.json({ message: "Signed in.", userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

app.get("/api/check-session", (req, res) => {
  res.json(
    req.session.userId
      ? { loggedIn: true, userId: req.session.userId }
      : { loggedIn: false }
  );
});

app.get("/api/user", async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ error: "Not logged in" });
  const pool = await poolPromise;
  const [rows] = await pool.query(
    "SELECT id, email, first_name FROM users WHERE id = ?",
    [req.session.userId]
  );
  if (!rows[0]) return res.status(404).json({ error: "User not found" });
  res.json(rows[0]);
});

const SPOTIFY_SCOPES = [
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-modify-private",
].join(" ");

app.get("/api/spotify/login", (req, res) => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_REDIRECT_URI) {
    return res.status(500).send("Spotify config missing");
  }
  const state = crypto.randomBytes(16).toString("hex");
  req.session.spotifyOAuthState = state;

  const params = querystring.stringify({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope: SPOTIFY_SCOPES,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

app.get("/api/spotify/callback", async (req, res) => {
  const { code, state } = req.query;
  if (state !== req.session.spotifyOAuthState) {
    return res.status(403).send("OAuth state mismatch");
  }
  delete req.session.spotifyOAuthState;

  const basicAuth = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    }),
  });

  if (!tokenRes.ok) {
    return res
      .status(400)
      .json({ error: "Failed to exchange code for tokens." });
  }
  const { access_token, refresh_token, expires_in } = await tokenRes.json();

  const pool = await poolPromise;
  await pool.query(
    `UPDATE users SET
       spotify_access_token   = ?,
       spotify_refresh_token  = ?,
       spotify_expires_at     = DATE_ADD(NOW(), INTERVAL ? SECOND)
     WHERE id = ?`,
    [access_token, refresh_token, expires_in, req.session.userId]
  );

  res.redirect("/home");
});

app.get("/api/spotify/status", async (req, res) => {
  if (!req.session.userId) return res.status(401).end();
  const pool = await poolPromise;
  const [rows] = await pool.query(
    "SELECT spotify_refresh_token IS NOT NULL AS connected FROM users WHERE id = ?",
    [req.session.userId]
  );
  res.json({ connected: Boolean(rows[0].connected) });
});

async function getValidSpotifyToken(userId) {
  const pool = await poolPromise;
  const [[user]] = await pool.query(
    `SELECT spotify_access_token, spotify_refresh_token, spotify_expires_at
     FROM users WHERE id = ?`,
    [userId]
  );

  if (!user?.spotify_refresh_token) {
    throw new Error("no-refresh-token");
  }
  if (dayjs().isBefore(dayjs(user.spotify_expires_at))) {
    return user.spotify_access_token;
  }

  const basicAuth = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: user.spotify_refresh_token,
    }),
  });
  const { access_token, refresh_token, expires_in } = await tokenRes.json();

  await pool.query(
    `UPDATE users SET
       spotify_access_token  = ?,
       spotify_refresh_token = ?,
       spotify_expires_at    = DATE_ADD(NOW(), INTERVAL ? SECOND)
     WHERE id = ?`,
    [
      access_token,
      refresh_token || user.spotify_refresh_token,
      expires_in,
      userId,
    ]
  );

  return access_token;
}

app.get("/api/spotify/token", async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).end();
    const token = await getValidSpotifyToken(req.session.userId);
    res.json({ access_token: token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/spotify/me", async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).end();
    const token = await getValidSpotifyToken(req.session.userId);
    const spotifyRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.status(spotifyRes.status).json(await spotifyRes.json());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/spotify/search", async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).end();
    const { query = "" } = req.query;
    const token = await getValidSpotifyToken(req.session.userId);
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/search?${querystring.stringify({
        q: query,
        type: "artist,track",
        limit: 10,
      })}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.status(spotifyRes.status).json(await spotifyRes.json());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/spotify/play", async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).end();
    const { deviceId, uris } = req.body;
    const token = await getValidSpotifyToken(req.session.userId);
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris }),
      }
    );
    if (spotifyRes.status === 204) return res.status(204).end();
    res.status(spotifyRes.status).json(await spotifyRes.json());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/playlists", async (req, res) => {
  if (!req.session.userId) return res.status(401).end();
  const pls = await Playlist.find({ userId: req.session.userId });
  res.json(pls);
});

app.post("/api/playlists", async (req, res) => {
  if (!req.session.userId) return res.status(401).end();
  const { name } = req.body;
  const pl = new Playlist({ userId: req.session.userId, name, songs: [] });
  await pl.save();
  res.status(201).json(pl);
});

app.post("/api/playlists/:id/songs", async (req, res) => {
  if (!req.session.userId) return res.status(401).end();
  const { id } = req.params;
  const { track } = req.body;

  const pl = await Playlist.findOne({ _id: id, userId: req.session.userId });
  if (!pl) return res.status(404).json({ error: "Playlist not found" });

  const song = {
    uri: track.uri,
    name: track.name,
    artists: Array.isArray(track.artists)
      ? track.artists.map((a) => a.name)
      : [],
    album: {
      name: track.album.name,
      images: Array.isArray(track.album.images)
        ? track.album.images.map((img) => ({ url: img.url }))
        : [],
    },
  };

  pl.songs.push(song);
  await pl.save();
  res.json(pl);
});

app.get("/api/spotify/audio-features", async (req, res) => {
  if (!req.session.userId) return res.status(401).end();
  const ids = req.query.ids;
  const token = await getValidSpotifyToken(req.session.userId);
  const spotifyRes = await fetch(
    `https://api.spotify.com/v1/audio-features?ids=${encodeURIComponent(ids)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  res.status(spotifyRes.status).json(await spotifyRes.json());
});

app.get("/*name", (_, res) =>
  res.sendFile(path.join(staticPath, "index.html"))
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
