import type { Job, SearchResult } from "./types";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function searchSong(query: string): Promise<SearchResult> {
  const res = await fetch(`${API_BASE}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("Não foi possível buscar a música");
  return res.json();
}

export async function startJob(
  songs: string[],
  titles: string[],
  downloadPath: string,
  playlistFirstOnly: string[]
): Promise<{ job_id: string }> {
  const res = await fetch(`${API_BASE}/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      songs,
      titles,
      download_path: downloadPath,
      playlist_first_only: playlistFirstOnly,
    }),
  });
  if (!res.ok) throw new Error("Failed to start job");
  return res.json();
}


export async function fetchStatus(jobId: string): Promise<Job> {
  const res = await fetch(`${API_BASE}/status/${jobId}`);
  if (!res.ok) throw new Error("Failed to fetch status");
  return res.json();
}
