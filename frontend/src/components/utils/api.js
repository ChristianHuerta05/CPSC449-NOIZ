export const apiFetch = async (path, opts = {}) => {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
};

export const signUp = (email, password) =>
  apiFetch("/api/signup", { method: "POST", body: { email, password } });
export const signIn = (email, password) =>
  apiFetch("/api/signin", { method: "POST", body: { email, password } });
export const checkSession = () => apiFetch("/api/check-session");

export const connectSpotify = () =>
  (window.location.href = "/api/spotify/login");
export const checkSpotifyStatus = () => apiFetch("/api/spotify/status");
export const searchArtists = (q) =>
  apiFetch(`/api/spotify/search?query=${encodeURIComponent(q)}`);
export const playTracks = (deviceId, uris) =>
  apiFetch("/api/spotify/play", {
    method: "PUT",
    body: { deviceId, uris },
  });
export const getSpotifyMe = () => apiFetch("/api/spotify/me");

export const getSpotifyToken = () => apiFetch("/api/spotify/token");

export const getArtist = (id) => apiFetch(`/api/spotify/artist/${id}`);
export const getArtistTracks = (id) =>
  apiFetch(`/api/spotify/artist/${id}/top-tracks`);
export const getArtistAlbums = (id) =>
  apiFetch(`/api/spotify/artist/${id}/albums`);
export const getUser = () => apiFetch("/api/user");

export const getPlaylists = () => apiFetch("/api/playlists");

export const createPlaylist = (name) =>
  apiFetch("/api/playlists", {
    method: "POST",
    body: { name },
  });

export const addSongToPlaylist = (playlistId, track) =>
  apiFetch(`/api/playlists/${playlistId}/songs`, {
    method: "POST",
    body: { track },
  });

export const getAudioFeatures = (idsCsv) =>
  apiFetch(`/api/spotify/audio-features?ids=${encodeURIComponent(idsCsv)}`);
