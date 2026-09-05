import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import PokedexApp from "@/pokedex/PokedexApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Metadex — Pokédex completo con mosse, evoluzioni e build" },
      {
        name: "description",
        content:
          "Metadex: consulta ogni Pokémon con statistiche, tipi, evoluzioni, mosse, forme, incontri di gioco e build competitive, in più lingue.",
      },
      { property: "og:title", content: "Metadex — Pokédex completo" },
      {
        property: "og:description",
        content:
          "Statistiche, tipi, evoluzioni, mosse, forme e build competitive per ogni Pokémon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function readInitialRoute() {
  const params = new URLSearchParams(window.location.search);
  const pokemon = Number(params.get("pokemon"));
  return {
    pokemon: Number.isInteger(pokemon) && pokemon > 0 ? pokemon : undefined,
    eggGroup: params.get("eggGroup") || undefined,
    type: params.get("type") || undefined,
  };
}

function Index() {
  // The Pokédex reads window/localStorage while rendering, so mount it on the client only.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-accent" />
          <p className="data-kicker text-xs uppercase">Caricamento Metadex…</p>
        </div>
      </div>
    );
  }

  const { pokemon, eggGroup, type } = readInitialRoute();
  return <PokedexApp initialId={pokemon} initialEggGroup={eggGroup} initialType={type} />;
}
