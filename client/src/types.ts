export type SongStatus =
  | "queued"
  | "searching"
  | "downloading"
  | "converting"
  | "tagging"
  | "completed"
  | "error";

export type JobStatus = "processing" | "completed" | "completed_with_errors";

export interface SongEntry {
  name: string;
  thumbnail?: string;
  status: SongStatus;
  message?: string;
}

export interface Job {
  job_id: string;
  status: JobStatus;
  songs: SongEntry[];
}

export interface UserSettings {
  download_path: string;
}

export type PlaylistMode = "all" | "first";

export interface SearchResult {
  url: string;
  title: string;
  thumbnail: string;
  is_playlist: boolean;
}

export interface QueueItem {
  id: string;
  query: string;
  result: SearchResult | null;
  state: "resolving" | "ready" | "error";
  error?: string;
}

export interface PlaylistEntry {
  url: string;
  title: string;
}
