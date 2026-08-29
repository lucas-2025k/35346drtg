import { Clock, Scissors, Sparkles, History } from "lucide-react";
import { formatarTempo, type VideoProcessado } from "@/lib/cortes";

export function DashboardCortes({ videos }: { videos: VideoProcessado[] }) {
  const cortes = videos.flatMap((v) => v.cortes);
  const media = cortes.length
    ? Math.round(cortes.reduce((s, c) => s + c.nota, 0) / cortes.length)
    : 0;
  const tempoEconomizado = cortes.length * 18;

  const cards = [
    { icone: Scissors, label: "Cortes gerados", valor: String(cortes.length) },
    { icone: Sparkles, label: "Nota média viral", valor: cortes.length ? `${media}/100` : "—" },
    { icone: Clock, label: "Tempo economizado", valor: `${tempoEconomizado} min` },
    { icone: History, label: "Vídeos processados", valor: String(videos.length) },
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="surface-panel rounded-2xl p-5">
            <c.icone className="size-5 text-primary" />
            <p className="mt-4 text-2xl font-bold">{c.valor}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      {videos.length > 0 && (
        <div className="surface-panel rounded-2xl p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Histórico
          </h3>
          <ul className="mt-4 space-y-3">
            {videos.map((v) => (
              <li
                key={v.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 text-sm last:border-0 last:pb-0"
              >
                <span className="truncate font-medium">{v.nome}</span>
                <span className="text-muted-foreground">
                  {formatarTempo(v.duracao)} · {v.cortes.length} cortes
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
