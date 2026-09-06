import type { ReactNode } from 'react';
import type { PokemonDetail, SpeciesData, LanguageCode } from '@/pokedex/types';
import { statColors, typeInfo } from '@/pokedex/data/typeInfo';
import { statLabels, t, pokeApiLangMap } from '@/pokedex/data/translations';
import { g } from '@/pokedex/data/gameTranslations';
import TypeBadge from './TypeBadge';
import { EntityChip } from './ResourceProvider';

import { Ruler, Weight, Sparkles } from 'lucide-react';

interface PokemonDetailProps {
  detail: PokemonDetail | null;
  species: SpeciesData | null;
  lang: LanguageCode;
  loading: boolean;
  /** Used to restore this detail after navigating to a type-filtered list. */
  selectedPokemonId?: number;
  /** Extended game data rendered below the base stats */
  extra?: ReactNode;
}

const statKeys = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'] as const;

function StatBar({ statKey, value, lang }: { statKey: string; value: number; lang: LanguageCode }) {
  const max = 255;
  const pct = Math.min((value / max) * 100, 100);
  const color = statColors[statKey];
  const label = statLabels[lang]?.[statKey] ?? statKey;

  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs font-medium text-gray-500">{label}</span>
      <span className="w-10 shrink-0 text-right text-sm font-bold tabular-nums text-gray-700">
        {value}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function PokemonDetail({
  detail,
  species,
  lang,
  loading,
  selectedPokemonId,
  extra,
}: PokemonDetailProps) {
  if (loading || !detail) {
    return (
      <div className="h-full overflow-hidden bg-[#fbfcf8]" aria-label={t(lang, 'loading_detail')}>
        <div className="h-44 animate-pulse bg-[#dceceb]" />
        <div className="space-y-5 px-6 py-6">
          <div className="h-3 w-11/12 animate-pulse rounded-full bg-[#e4eded]" />
          <div className="h-3 w-8/12 animate-pulse rounded-full bg-[#e4eded]" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="h-12 animate-pulse rounded-xl bg-[#eef4f2]" />
            <div className="h-12 animate-pulse rounded-xl bg-[#eef4f2]" />
          </div>
          <div className="space-y-3 pt-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-2.5 w-16 animate-pulse rounded-full bg-[#e4eded]" />
                <div className="h-2.5 flex-1 animate-pulse rounded-full bg-[#dceceb]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const apiLang = pokeApiLangMap[lang];
  const displayName = species?.names?.[apiLang] ?? species?.names?.['en'] ?? detail.name;
  const description = species?.descriptions?.[apiLang] ?? species?.descriptions?.['en'] ?? '';
  const genus = species?.genera?.[apiLang] ?? species?.genera?.['en'] ?? '';
  const total = statKeys.reduce((sum, k) => sum + detail.stats[k], 0);
  const primaryColor = (detail.types[0] ? typeInfo[detail.types[0]]?.color : undefined) ?? '#DC0A2D';
  const secondaryColor = (detail.types[1] ? typeInfo[detail.types[1]]?.color : undefined) ?? primaryColor;

  return (
   <div className="flex h-full flex-col overflow-y-scroll bg-[#fbfcf8] pokeball-scroll">
      {/* Header section with type-colored gradient */}
      <div
        className="pokemon-detail-header relative shrink-0 overflow-hidden px-6 pt-5 pb-8 sm:px-8"
        style={{
          background: [
            `radial-gradient(circle at 88% 8%, color-mix(in srgb, ${secondaryColor} 55%, white 45%) 0%, transparent 52%)`,
            `radial-gradient(circle at 4% 96%, color-mix(in srgb, ${primaryColor} 55%, black 45%) 0%, transparent 58%)`,
            `radial-gradient(circle at 55% 120%, color-mix(in srgb, ${secondaryColor} 80%, white 20%) 0%, transparent 45%)`,
            `linear-gradient(135deg, color-mix(in srgb, ${primaryColor} 88%, black 12%) 0%, ${primaryColor} 38%, color-mix(in srgb, ${primaryColor} 35%, ${secondaryColor} 65%) 68%, ${secondaryColor} 100%)`,
          ].join(', '),
        }}
      >
        {/* Decorative layers — kept behind the content, never under text with contrast issues */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          {/* Large Poké Ball silhouette behind the artwork */}
          <svg
            viewBox="0 0 200 200"
            className="absolute -right-8 -bottom-14 h-56 w-56 opacity-20 sm:h-64 sm:w-64"
            style={{ color: 'white' }}
          >
            <circle cx="100" cy="100" r="96" fill="currentColor" fillOpacity="0.25" />
            <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="6" />
            <path d="M4 100 H192" stroke="currentColor" strokeWidth="12" />
            <circle cx="100" cy="100" r="24" fill="currentColor" fillOpacity="0.9" />
            <circle cx="100" cy="100" r="12" fill="none" stroke="currentColor" strokeWidth="5" strokeOpacity="0.6" />
          </svg>
          {/* Soft rings, top-left */}
          <div
            className="absolute -top-16 -left-16 h-48 w-48 rounded-full border-[14px]"
            style={{ borderColor: 'color-mix(in srgb, white 22%, transparent)' }}
          />
          <div
            className="absolute top-10 -left-8 h-24 w-24 rounded-full border-8"
            style={{ borderColor: 'color-mix(in srgb, white 14%, transparent)' }}
          />
          {/* Sparkle dots */}
          <div className="absolute top-6 left-1/3 h-2 w-2 rounded-full bg-white/40" />
          <div className="absolute top-16 left-1/4 h-1.5 w-1.5 rounded-full bg-white/30" />
          <div className="absolute bottom-6 right-1/3 h-2.5 w-2.5 rounded-full bg-white/25" />
          {/* Diagonal sheen */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(115deg, transparent 30%, color-mix(in srgb, white 10%, transparent) 45%, transparent 60%)',
            }}
          />
          {/* Bottom fade into the page background for a smooth transition */}
          <div
            className="absolute inset-x-0 bottom-0 h-10"
            style={{ background: 'linear-gradient(to top, color-mix(in srgb, black 18%, transparent), transparent)' }}
          />
        </div>

        {/* Number badge — top right on mobile, right column on desktop */}
        <div className="relative z-10 flex justify-end sm:hidden">
          <div
            className="pokemon-detail-number"
            style={{
              fontSize: 'clamp(1.6rem, 6vw, 2.25rem)',
              transform: 'skewX(-8deg)',
            }}
          >
            #{String(detail.id).padStart(4, '0')}
          </div>
        </div>

        {/* Main banner row: artwork | info | number, evenly distributed */}
        <div className="relative z-10 mt-2 flex w-full flex-col items-center gap-4 sm:mt-3 sm:grid sm:grid-cols-[auto_1fr_auto] sm:items-center">
          {/* Pokémon artwork — left column */}
          <div className="flex h-28 w-28 shrink-0 items-center justify-center sm:h-32 sm:w-32">
            <img
              src={detail.artworkUrl}
              alt={displayName}
              className="max-h-full max-w-full object-contain object-center drop-shadow-lg"
            />
          </div>

          {/* Name, genus and types — centered column */}
          <div className="w-full min-w-0 px-2 text-center sm:px-0">
            <p
              className="truncate text-sm font-medium uppercase tracking-widest text-white/80"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
            >
              {genus}
            </p>
            <h2
              className="break-words text-3xl font-black capitalize text-white sm:break-normal sm:text-4xl"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}
            >
              {displayName}
            </h2>
            <div className="type-badge-cluster mt-3 justify-center">
              {detail.types.map((tp) => (
                <TypeBadge
                  key={tp}
                  type={tp}
                  size="lg"
                  lang={lang}
                  pokemonId={selectedPokemonId ?? detail.id}
                />
              ))}
            </div>
          </div>

        {/* Number — right column, balances the artwork on the left */}
          <div className="hidden shrink-0 self-center pl-2 sm:block">
            <div 
              className="font-black text-white/50 drop-shadow-md"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                transform: 'skewX(-8deg)'
              }}
            >
              #{String(detail.id).padStart(4, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
     <div className="min-w-0 flex-1 px-6 py-5">
        {/* Description */}
        {description && (
          <p className="text-sm leading-relaxed text-gray-600">{description}</p>
        )}

        {/* Physical info */}
        <div className="mt-5 flex gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <Ruler size={18} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{t(lang, 'height')}</p>
              <p className="text-sm font-semibold text-gray-700">
                {(detail.height / 10).toFixed(1)} m
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <Weight size={18} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{t(lang, 'weight')}</p>
              <p className="text-sm font-semibold text-gray-700">
                {(detail.weight / 10).toFixed(1)} kg
              </p>
            </div>
          </div>
        </div>

        {/* Abilities */}
        <div className="mt-5">
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
            <Sparkles size={14} />
            {t(lang, 'abilities')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {detail.abilities.map((a, i) => (
              <EntityChip
                key={a}
                kind="ability"
                slug={a}
                lang={lang}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all active:scale-95 ${
                  i === 0
                    ? 'bg-pokedex-red/10 text-pokedex-red hover:bg-pokedex-red/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                suffix={
                  detail.abilityDetails?.[i]?.isHidden ? (
                    <span className="text-[10px] uppercase tracking-wide opacity-60">
                      ({g(lang, 'ability_hidden')})
                    </span>
                  ) : null
                }
              />
            ))}
          </div>

        </div>

        {/* Base Stats */}
        <div className="mt-6">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            {t(lang, 'base_stats')}
          </h3>
          <div className="space-y-2.5">
            {statKeys.map((k) => (
              <StatBar key={k} statKey={k} value={detail.stats[k]} lang={lang} />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {t(lang, 'total')}
            </span>
            <span className="text-lg font-black tabular-nums text-gray-700">{total}</span>
          </div>
        </div>

        {extra}
      </div>
    </div>
  );
}
