import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Scissors } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { UploadCortes } from "@/components/UploadCortes";
import { ListaCortes } from "@/components/ListaCortes";
import { DashboardCortes } from "@/components/DashboardCortes";
import type { VideoProcessado } from "@/lib/cortes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cortes de Valor IA — Cortes virais automáticos para Reels e Shorts" },
      {
        name: "description",
        content:
          "Envie um vídeo MP4 e receba os melhores cortes verticais com título, nota de viralização e legenda automática.",
      },
      { property: "og:title", content: "Cortes de Valor IA" },
      {
        property: "og:description",
        content:
          "IA que encontra os momentos mais virais do seu vídeo e gera cortes 9:16 prontos para publicar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [videos, setVideos] = useState<VideoProcessado[]>([]);
  const [atual, setAtual] = useState<{ video: VideoProcessado; url: string } | null>(null);

  return (
    <div className="min-h-screen">
      <Toaster />
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-2">
            <span className="glow-gold flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <Scissors className="size-4 text-primary" />
            </span>
            <span className="font-display text-lg font-semibold">
              Cortes de <span className="text-gradient-gold">Valor IA</span>
            </span>
          </div>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:block">
            TikTok · Reels · Shorts
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-12">
        <section className="text-center">
          <h1 className="text-balance text-4xl font-bold sm:text-5xl">
            Os melhores momentos do seu vídeo,
            <br />
            <span className="text-gradient-gold">encontrados pela IA</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Envie um MP4 e receba de 5 a 20 cortes verticais com título, nota de viralização,
            motivo da recomendação e legenda automática.
          </p>
        </section>

        <UploadCortes
          onConcluido={(video, url) => {
            setVideos((v) => [video, ...v]);
            setAtual({ video, url });
          }}
        />

        <DashboardCortes videos={videos} />

        {atual && (
          <section className="space-y-5">
            <h2 className="text-2xl font-bold">Cortes gerados</h2>
            <ListaCortes video={atual.video} url={atual.url} />
          </section>
        )}
      </main>
    </div>
  );
}
