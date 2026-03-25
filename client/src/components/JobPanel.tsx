import type { Job } from "../types";
import StatusBadge from "./StatusBadge";

interface Props {
  job: Job;
}

const DONE = ["completed", "completed_with_errors"];

export default function JobPanel({ job }: Props) {
  const isDone = DONE.includes(job.status);

  return (
    <div className="job-panel">
      <div className="job-header">
        <span className="job-id">Job: {job.job_id}</span>
        <StatusBadge status={isDone ? job.status : "processing"} />
      </div>

      <ul className="song-list">
        {job.songs.map((song, i) => (
          <li key={i} className="song-item">
            <span className="song-name">{song.name}</span>
            <div className="song-right">
              {song.message && (
                <span className="song-error">{song.message}</span>
              )}
              <StatusBadge status={song.status} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
