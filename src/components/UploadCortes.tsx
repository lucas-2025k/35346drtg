import { useRef, useState } from "react";
import { Film, UploadCloud, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ETAPAS,
  formatarTamanho,
  formatarTempo,
  gerarCortes,
  type VideoProcessado,
} from "@/lib/cortes";

type Props = {
  onConcluido: (video: VideoProcessado, url: string) => void;
};

export function UploadCortes({ onConcluido }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [duracao, setDuracao] = useState(0);
  const [progresso, setProgresso] = useState(0);
  const [etapa, setEtapa] = useState<number | null>(null);
  const [arrastando, setArrastando] = useState(false);

  async function lerDuracao(file: File) {
    return new Promise<number>((resolve) => {
      const el = document.createElement("video");
      el.preload = "metadata";
      el.onloadedmetadata = () => {
        const d = Number.isFinite(el.duration) ? el.duration : 600;
        URL.revokeObjectURL(el.src);
        resolve(d);
      };
      el.onerror = () => resolve(600);
      el.src = URL.createObjectURL(file);
    });
  }

  async function processar(file: File) {
    setArquivo(file);
    setProgresso(0);
    setEtapa(0);
    const d = await lerDuracao(file);
    setDuracao(d);

    for (let i = 0; i < ETAPAS.length; i++) {
      setEtapa(i);
      for (let p = 0; p <= 100; p += 4) {
        setProgresso(Math.round(((i * 100 + p) / (ETAPAS.length * 100)) * 100));
        await new Promise((r) => setTimeout(r, 14));
      }
    }

    setEtapa(null);
    onConcluido(
      {
        id: `${Date.now()}`,
        nome: file.name,
        duracao: d,
        tamanho: file.size,
        criadoEm: Date.now(),
        cortes: gerarCortes(d),
      },
      URL.createObjectURL(file),
    );
  }

  function selecionar(files: FileList | null) {
    const file = files?.[0];
    if (file && file.type.includes("mp4")) void processar(file);
  }

  const processando = etapa !== null;

  return (
    <div className="surface-panel rounded-3xl p-6 sm:p-8">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          selecionar(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center transition-colors ${
          arrastando ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <div className="glow-gold mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <UploadCloud className="size-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Envie seu vídeo MP4</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Arraste o arquivo aqui ou selecione no seu dispositivo. A IA cuida do resto.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4"
          className="hidden"
          onChange={(e) => selecionar(e.target.files)}
        />
        <Button
          className="mt-6"
          size="lg"
          disabled={processando}
          onClick={() => inputRef.current?.click()}
        >
          <Sparkles className="mr-2 size-4" />
          {processando ? "Processando..." : "Selecionar vídeo"}
        </Button>
      </div>

      {arquivo && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Film className="size-4 text-primary" />
            <span className="font-medium">{arquivo.name}</span>
            <span className="text-muted-foreground">{formatarTempo(duracao)}</span>
            <span className="text-muted-foreground">{formatarTamanho(arquivo.size)}</span>
          </div>
          <Progress value={progresso} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {processando ? `${ETAPAS[etapa]}... ${progresso}%` : "Análise concluída."}
          </p>
        </div>
      )}
    </div>
  );
}
