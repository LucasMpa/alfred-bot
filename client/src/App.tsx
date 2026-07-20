import { useState, useEffect, useRef } from "react";
import { searchSong, startJob, fetchStatus } from "./api";
import JobPanel from "./components/JobPanel";
import SettingsModal from "./components/SettingsModal";
import PlaylistConfirmModal from "./components/PlaylistConfirmModal";
import type { Job, UserSettings, PlaylistMode, QueueItem, PlaylistEntry } from "./types";

const POLL_INTERVAL = 2000;
const DONE_STATUSES = ["completed", "completed_with_errors"];
const SETTINGS_KEY = "user_settings";
const YOUTUBE_PATTERN = /^https?:\/\/(www\.|m\.)?youtube\.com\/watch|^https?:\/\/youtu\.be\//;

function isYoutubeUrl(value: string): boolean {
  return YOUTUBE_PATTERN.test(value);
}

function loadSettings(): UserSettings | null {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as UserSettings) : null;
  } catch {
    return null;
  }
}

function persistSettings(settings: UserSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export default function App() {
  const [input, setInput] = useState("");
  const [songs, setSongs] = useState<QueueItem[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [pendingPlaylists, setPendingPlaylists] = useState<PlaylistEntry[] | null>(null);
  const pollers = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  useEffect(() => {
    const stored = loadSettings();
    if (stored) {
      setSettings(stored);
    } else {
      setShowSettings(true);
    }
  }, []);

  function handleSaveSettings(newSettings: UserSettings) {
    persistSettings(newSettings);
    setSettings(newSettings);
    setShowSettings(false);
  }

  async function addSong() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");

    const id = crypto.randomUUID();
    setSongs((prev) => [...prev, { id, query: trimmed, result: null, state: "resolving" }]);

    try {
      const result = await searchSong(trimmed);
      setSongs((prev) =>
        prev.map((s) => (s.id === id ? { ...s, result, state: "ready" } : s))
      );
    } catch (e) {
      setSongs((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, state: "error", error: (e as Error).message } : s
        )
      );
    }
  }

  function removeSong(id: string) {
    setSongs((prev) => prev.filter((s) => s.id !== id));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") void addSong();
  }

  function startPolling(jobId: string) {
    if (pollers.current[jobId]) return;

    pollers.current[jobId] = setInterval(async () => {
      try {
        const data = await fetchStatus(jobId);
        setJobs((prev) => prev.map((j) => (j.job_id === jobId ? data : j)));
        if (DONE_STATUSES.includes(data.status)) {
          clearInterval(pollers.current[jobId]);
          delete pollers.current[jobId];
        }
      } catch {
        clearInterval(pollers.current[jobId]);
        delete pollers.current[jobId];
      }
    }, POLL_INTERVAL);
  }

  async function submitJob(playlistFirstOnly: string[]) {
    if (!settings) return;
    setLoading(true);
    setError(null);

    const readySongs = songs.filter((s) => s.state === "ready");
    const urls = readySongs.map((s) => s.result!.url);
    const titles = readySongs.map((s) => s.result!.title);
    const thumbnails = readySongs.map((s) => s.result!.thumbnail);

    try {
      const { job_id } = await startJob(
        urls,
        titles,
        thumbnails,
        settings.download_path,
        playlistFirstOnly
      );
      const initial: Job = {
        job_id,
        status: "processing",
        songs: readySongs.map((s) => ({
          name: s.result!.title,
          thumbnail: s.result!.thumbnail,
          status: "queued",
        })),
      };
      setJobs((prev) => [initial, ...prev]);
      setSongs([]);
      startPolling(job_id);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit() {
    if (songs.length === 0 || !settings) return;

    const readySongs = songs.filter((s) => s.state === "ready");
    const playlists = readySongs
      .filter((s) => s.result!.is_playlist)
      .map((s) => ({ url: s.result!.url, title: s.result!.title }));

    if (playlists.length > 0) {
      setPendingPlaylists(playlists);
    } else {
      void submitJob([]);
    }
  }

  function handlePlaylistConfirm(mode: PlaylistMode) {
    const firstOnly = mode === "first" ? (pendingPlaylists ?? []).map((p) => p.url) : [];
    setPendingPlaylists(null);
    void submitJob(firstOnly);
  }

  useEffect(() => {
    return () => {
      Object.values(pollers.current).forEach(clearInterval);
    };
  }, []);

  const isResolving = songs.some((s) => s.state === "resolving");
  const hasReady = songs.some((s) => s.state === "ready");

  return (
    <div className="app">
      {showSettings && (
        <SettingsModal initial={settings ?? {}} onSave={handleSaveSettings} />
      )}

      {pendingPlaylists && (
        <PlaylistConfirmModal
          playlists={pendingPlaylists}
          onConfirm={handlePlaylistConfirm}
        />
      )}

      <header className="app-header">
        <h1>🤵🏻‍♂️ Alfred</h1>
        <p>Baixe músicas do YouTube</p>
        <p style={{opacity: 0.5}}>(Em breve no soundcloud 🫵)</p>
        <button
          className="settings-btn"
          onClick={() => setShowSettings(true)}
          title="Configurações"
        >
          ⚙
        </button>
      </header>

      <main className="app-main">
        <section className="input-section">
          <div className="input-row">
            <input
              type="text"
              placeholder="Nome da música ou link do YouTube..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={() => void addSong()} disabled={!input.trim()}>
              Adicionar
            </button>
          </div>

          {songs.length > 0 && (
            <ul className="queue-list">
              {songs.map((item) => {
                const tag = item.result?.is_playlist
                  ? { label: "Playlist", cls: "tag-playlist" }
                  : isYoutubeUrl(item.query)
                  ? { label: "Link", cls: "tag-url" }
                  : { label: "Busca", cls: "tag-search" };

                return (
                  <li key={item.id} className="queue-item">
                    <div className="queue-thumb">
                      {item.state === "resolving" && <div className="thumb-skeleton" />}
                      {item.state === "error" && <div className="thumb-error">?</div>}
                      {item.state === "ready" && (
                        <img src={item.result!.thumbnail} alt="" className="thumb-img" />
                      )}
                    </div>

                    <div className="queue-info">
                      {item.state === "resolving" && (
                        <span className="queue-resolving">Buscando...</span>
                      )}
                      {item.state === "error" && (
                        <span className="queue-error-text">
                          {item.error ?? "Não encontrado"}
                        </span>
                      )}
                      {item.state === "ready" && (
                        <span className="queue-item-name">{item.result!.title}</span>
                      )}
                      <span className="queue-item-query">{item.query}</span>
                    </div>

                    <div className="queue-item-right">
                      {item.state === "ready" && (
                        <span className={`queue-type-tag ${tag.cls}`}>{tag.label}</span>
                      )}
                      <button
                        className="remove-btn"
                        onClick={() => removeSong(item.id)}
                        aria-label="Remover"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {error && <p className="error-msg">{error}</p>}
          {isResolving && (
            <p className="info-msg">Aguardando resultado da busca...</p>
          )}

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!hasReady || isResolving || loading || !settings}
          >
            {loading
              ? "Enviando..."
              : `Baixar${hasReady ? ` (${songs.filter((s) => s.state === "ready").length})` : ""}`}
          </button>
        </section>

        {jobs.length > 0 && (
          <section className="jobs-section">
            <h2>Jobs</h2>
            {jobs.map((job) => (
              <JobPanel key={job.job_id} job={job} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
