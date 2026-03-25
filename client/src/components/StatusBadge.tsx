import type { SongStatus, JobStatus } from "../types";

type Status = SongStatus | JobStatus;

interface StatusConfig {
  label: string;
  color: string;
}

const config: Partial<Record<Status, StatusConfig>> = {
  queued:                { label: "Na fila",     color: "#6b7280" },
  searching:             { label: "Buscando",    color: "#f59e0b" },
  downloading:           { label: "Baixando",    color: "#3b82f6" },
  converting:            { label: "Convertendo", color: "#8b5cf6" },
  tagging:               { label: "Tagueando",   color: "#ec4899" },
  completed:             { label: "Concluído",   color: "#10b981" },
  completed_with_errors: { label: "Com erros",   color: "#f59e0b" },
  processing:            { label: "Processando", color: "#3b82f6" },
  error:                 { label: "Erro",        color: "#ef4444" },
};

const spinning: Status[] = ["searching", "downloading", "converting", "tagging", "processing"];

interface Props {
  status: Status;
}

export default function StatusBadge({ status }: Props) {
  const { label, color } = config[status] ?? { label: status, color: "#6b7280" };
  const isSpinning = spinning.includes(status);

  return (
    <span className="badge" style={{ "--badge-color": color } as React.CSSProperties}>
      {isSpinning && <span className="spinner" />}
      {label}
    </span>
  );
}
