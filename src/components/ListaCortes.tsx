import { useState } from "react";
import { Copy, Download, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatarTempo, type Corte, type VideoProcessado } from "@/lib/cortes";

type Props = { video: VideoProcessado; url: string };

export function ListaCortes({ video, url }: Props) {
  const [ativo, setAtivo] = useState<Corte>(video.cortes[0]!);

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <div className="surface-panel h-fit rounded-3xl p-5">
        <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-2xl border border-border bg-black">
          <video
            key={ativo.id}
            src={`${url}#t=${Math.floor(ativo.inicio)},${Math.floor(ativo.fim)}`}
            controls
            className="aspect-[9/16] w-full object-cover"
          />
        </div>
        <p className="mt-4 text-sm font-semibold">{ativo.titulo}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatarTempo(ativo.inicio)} – {formatarTempo(ativo.fim)} · formato 9:16
        </p>
        <p className="mt-3 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
          Legenda automática: “{ativo.legenda}”
        </p>
      </div>

      <div className="space-y-3">
        {video.cortes.map((corte) => (
          <article
            key={corte.id}
            className={`surface-panel rounded-2xl p-5 transition-colors ${
              ativo.id === corte.id ? "ring-1 ring-primary/60" : ""
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="truncate text-base font-semibold">{corte.titulo}</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatarTempo(corte.inicio)} → {formatarTempo(corte.fim)} ·{" "}
                  {Math.round(corte.fim - corte.inicio)}s
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gradient-gold">{corte.nota}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  nota viral
                </p>
              </div>
            </div>

            <Badge variant="outline" className="mt-3 border-primary/40 text-primary">
              {corte.categoria}
            </Badge>
            <p className="mt-3 text-sm text-muted-foreground">{corte.motivo}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setAtivo(corte)}>
                <Play className="mr-1.5 size-3.5" /> Assistir
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toast.info("Renderização de MP4 exige o servidor de processamento.")}
              >
                <Download className="mr-1.5 size-3.5" /> Baixar MP4
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  void navigator.clipboard.writeText(corte.titulo);
                  toast.success("Título copiado");
                }}
              >
                <Copy className="mr-1.5 size-3.5" /> Copiar título
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
