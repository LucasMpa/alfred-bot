import type { PlaylistEntry, PlaylistMode } from "../types";

interface Props {
  playlists: PlaylistEntry[];
  onConfirm: (mode: PlaylistMode) => void;
}

export default function PlaylistConfirmModal({ playlists, onConfirm }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Playlists detectadas</h2>
        <p className="modal-subtitle">
          {playlists.length === 1
            ? "Uma playlist foi encontrada na fila."
            : `${playlists.length} playlists foram encontradas na fila.`}
        </p>

        <ul className="playlist-preview">
          {playlists.map((p, i) => (
            <li key={i} className="playlist-preview-item">
              {p.title}
            </li>
          ))}
        </ul>

        <p className="modal-subtitle">Como deseja baixá-las?</p>

        <div className="modal-actions modal-actions--row">
          <button className="btn-secondary" onClick={() => onConfirm("first")}>
            Apenas a primeira música
          </button>
          <button className="submit-btn" onClick={() => onConfirm("all")}>
            Playlist inteira
          </button>
        </div>
      </div>
    </div>
  );
}
