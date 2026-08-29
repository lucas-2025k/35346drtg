export type Categoria =
  | "História impactante"
  | "Curiosidade"
  | "Humor"
  | "Polêmica"
  | "Frase forte"
  | "Emoção"
  | "Alta retenção";

export type Corte = {
  id: string;
  titulo: string;
  nota: number;
  inicio: number;
  fim: number;
  categoria: Categoria;
  motivo: string;
  legenda: string;
};

export type VideoProcessado = {
  id: string;
  nome: string;
  duracao: number;
  tamanho: number;
  criadoEm: number;
  cortes: Corte[];
};

const TITULOS: { titulo: string; categoria: Categoria; motivo: string }[] = [
  {
    titulo: "Ele ficou 3 dias sem comer",
    categoria: "História impactante",
    motivo: "Momento emocional com forte curiosidade e alta retenção.",
  },
  {
    titulo: "Ninguém te conta isso sobre dinheiro",
    categoria: "Curiosidade",
    motivo: "Abertura em loop mental: promete um segredo e entrega na sequência.",
  },
  {
    titulo: "O erro que quase acabou com tudo",
    categoria: "História impactante",
    motivo: "Tensão narrativa crescente com virada no final do trecho.",
  },
  {
    titulo: "Essa opinião vai gerar discussão",
    categoria: "Polêmica",
    motivo: "Declaração divisiva com alto potencial de comentários.",
  },
  {
    titulo: "Não consegui segurar o riso",
    categoria: "Humor",
    motivo: "Pico de humor espontâneo, ideal para replays curtos.",
  },
  {
    titulo: "A frase que mudou minha vida",
    categoria: "Frase forte",
    motivo: "Frase de impacto isolada, funciona como citação viral.",
  },
  {
    titulo: "Ele se emocionou ao lembrar disso",
    categoria: "Emoção",
    motivo: "Pausa emocional com variação vocal alta e forte empatia.",
  },
  {
    titulo: "Faça isso antes dos 30",
    categoria: "Alta retenção",
    motivo: "Conselho direto com estrutura de lista, retém até o final.",
  },
  {
    titulo: "O que aconteceu depois foi surreal",
    categoria: "Curiosidade",
    motivo: "Cliffhanger natural que segura o espectador no corte.",
  },
  {
    titulo: "Todo mundo faz isso errado",
    categoria: "Polêmica",
    motivo: "Contradiz o senso comum e provoca reação imediata.",
  },
];

const LEGENDAS = [
  "isso mudou completamente a minha forma de ver o assunto",
  "e foi exatamente aí que tudo começou a fazer sentido",
  "presta atenção nessa parte porque quase ninguém percebe",
  "eu levei anos pra entender o que vou te falar agora",
  "o resultado disso foi muito melhor do que eu esperava",
];

export function formatarTempo(segundos: number) {
  const s = Math.max(0, Math.round(segundos));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function formatarTamanho(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Gera a análise de cortes. Hoje roda de forma simulada no navegador
 * (heurística determinística baseada na duração do vídeo).
 */
export function gerarCortes(duracao: number): Corte[] {
  const quantidade = Math.max(5, Math.min(20, Math.round(duracao / 60) + 4));
  const cortes: Corte[] = [];
  const janela = duracao / quantidade;

  for (let i = 0; i < quantidade; i++) {
    const base = TITULOS[i % TITULOS.length]!;
    const duracaoCorte = Math.min(Math.max(22, Math.round(janela * 0.55)), 58);
    const inicio = Math.min(
      Math.max(0, Math.round(i * janela + janela * 0.15)),
      Math.max(0, duracao - duracaoCorte),
    );
    const fim = Math.min(duracao, inicio + duracaoCorte);
    const nota = Math.max(58, 97 - i * 2 - (i % 3));

    cortes.push({
      id: `corte-${i + 1}`,
      titulo: base.titulo,
      categoria: base.categoria,
      motivo: base.motivo,
      nota,
      inicio,
      fim,
      legenda: LEGENDAS[i % LEGENDAS.length]!,
    });
  }

  return cortes.sort((a, b) => b.nota - a.nota);
}

export const ETAPAS = [
  "Enviando vídeo",
  "Transcrevendo áudio",
  "Analisando picos de retenção",
  "Selecionando os melhores momentos",
  "Renderizando cortes 9:16 com legendas",
];
