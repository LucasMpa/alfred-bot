import { useState } from "react";
import type { UserSettings } from "../types";

interface Props {
  initial: Partial<UserSettings>;
  onSave: (settings: UserSettings) => void;
}

export default function SettingsModal({ initial, onSave }: Props) {
  const [downloadPath, setDownloadPath] = useState(initial.download_path ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    if (!downloadPath.trim()) {
      setError("Informe o caminho da pasta de destino.");
      return;
    }
    onSave({ download_path: downloadPath.trim() });
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Preferências</h2>
        <p className="modal-subtitle">
          Configure suas preferências antes de começar.
        </p>

        <div className="modal-field">
          <label htmlFor="download-path">Pasta de destino dos downloads</label>
          <input
            id="download-path"
            type="text"
            placeholder="Ex: /Users/seu-usuario/Music"
            value={downloadPath}
            onChange={(e) => {
              setError(null);
              setDownloadPath(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
          {error && <span className="modal-field-error">{error}</span>}
        </div>

        <div className="modal-actions">
          <button className="submit-btn" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
