import { useEffect, useMemo, useState } from 'react';
import type {
  PokemonDetail,
  SpeciesData,
  EvolutionStage,
  LanguageCode,
} from '@/pokedex/types';
import { getSpriteUrl, fetchFormVariety, type FormVariety } from '@/pokedex/services/pokeapi';
import { g, triggerLabel } from '@/pokedex/data/gameTranslations';
import { u } from '@/pokedex/data/uiTranslations';
import { e } from '@/pokedex/data/evoLabels';
import { f, categorize, formSuffix } from '@/pokedex/data/formLabels';
import { megaStones } from '@/pokedex/data/megaStones';
import { typeNames } from '@/pokedex/data/translations';
import { placeName } from '@/pokedex/data/placeNames';
import { useLocalName, useResourceDialog } from './ResourceProvider';

const ITEM_SPRITE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';

/** Small clickable item pill used inside an arrow label. */
function ItemPill({ slug, lang }: { slug: string; lang: LanguageCode }) {
  const { open } = useResourceDialog();
  const name = useLocalName('item', slug, lang);
  return (
    <button
      type="button"
      onClick={() => open('item', slug)}
      title={`${name} — ${u(lang, 'click_hint')}`}
      className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-1.5 py-[1px] transition-all hover:border-pokedex-red hover:shadow-sm active:scale-95"
    >
      <img
        src={`${ITEM_SPRITE}/${slug}.png`}
        alt={name}
        loading="lazy"
        className="h-4 w-4 object-contain"
        onError={(ev) => {
          (ev.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
      <span className="max-w-[120px] truncate text-[10px] font-bold text-gray-700">{name}</span>
    </button>
  );
}

/** Human readable text parts of an evolution requirement (no items: those get a pill). */
function useRequirementText(stage: EvolutionStage, lang: LanguageCode): string {
  const moveName = useLocalName('move', stage.knownMove, lang);
  const locationName = useLocalName('location', stage.location, lang);
  const tradeName = useLocalName('pokemon-species', stage.tradeSpecies, lang);

  const parts: string[] = [];
  const trigger = stage.trigger ?? '';

  if (stage.minLevel) parts.push(`${g(lang, 'level')} ${stage.minLevel}`);
  else if (trigger && trigger !== 'use-item' && trigger !== 'trade') {
    parts.push(triggerLabel(lang, trigger));
  } else if (trigger === 'level-up') parts.push(triggerLabel(lang, trigger));

  if (stage.knownMove) parts.push(moveName);
  if (stage.knownMoveType) {
    parts.push(`${u(lang, 'move')} ${typeNames[lang]?.[stage.knownMoveType] ?? stage.knownMoveType}`);
  }
  if (stage.minHappiness) parts.push(`${e(lang, 'happiness')} ${stage.minHappiness}`);
  if (stage.minAffection) parts.push(`${e(lang, 'affection')} ${stage.minAffection}`);
  if (stage.minBeauty) parts.push(`${e(lang, 'beauty')} ${stage.minBeauty}`);
  if (stage.timeOfDay) {
    const key =
      stage.timeOfDay === 'day' ? 'time_day' : stage.timeOfDay === 'night' ? 'time_night' : 'time_dusk';
    parts.push(e(lang, key));
  }
  if (stage.location) parts.push(placeName(lang, locationName));
  if (stage.needsRain) parts.push(e(lang, 'rain'));
  if (stage.gender === 1) parts.push(e(lang, 'female'));
  if (stage.gender === 2) parts.push(e(lang, 'male'));
  if (stage.tradeSpecies) parts.push(`${e(lang, 'trade_with')} ${tradeName}`);
  if (stage.turnUpsideDown) parts.push(e(lang, 'upside_down'));

  return parts.join(' · ');
}

/** Arrow with the requirement written above it. */
function Arrow({
  text,
  items,
  trade,
  accent = 'gray',
  lang,
}: {
  text: string;
  items?: (string | null)[];
  trade?: boolean;
  accent?: 'gray' | 'mega';
  lang: LanguageCode;
}) {
  const stroke = accent === 'mega' ? '#C026D3' : '#9CA3AF';
  const itemSlugs = (items ?? []).filter((s): s is string => Boolean(s));

  return (
    <div className="flex min-w-[112px] flex-col items-center justify-center px-1">
      <div className="mb-1 flex flex-col items-center gap-1">
        {text && (
          <span
            className={`text-center text-[10px] font-bold leading-tight ${
              accent === 'mega' ? 'text-fuchsia-600' : 'text-gray-600'
            }`}
          >
            {text}
          </span>
        )}
        {itemSlugs.map((slug) => (
          <ItemPill key={slug} slug={slug} lang={lang} />
        ))}
        {trade && (
          <span className="rounded-full border border-blue-200 bg-blue-50 px-1.5 py-[1px] text-[10px] font-bold text-blue-700">
            {triggerLabel(lang, 'trade')}
          </span>
        )}
      </div>
      <svg width="100%" height="12" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden>
        <line x1="2" y1="6" x2="88" y2="6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <polygon points="88,1 98,6 88,11" fill={stroke} />
      </svg>
    </div>
  );
}

function StageNode({
  id,
  label,
  sprite,
  active,
  accent = 'gray',
  onClick,
}: {
  id: number;
  label: string;
  sprite: string;
  active: boolean;
  accent?: 'gray' | 'mega';
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      data-stage-id={id}
      className={`flex w-[104px] shrink-0 flex-col items-center rounded-xl border p-2 text-center transition-all ${
        onClick ? 'hover:shadow-md' : 'cursor-default'
      } ${
        active
          ? 'border-pokedex-red bg-pokedex-red/5'
          : accent === 'mega'
            ? 'border-fuchsia-200 bg-fuchsia-50/60'
            : 'border-gray-200 bg-white'
      }`}
    >
      <img src={sprite} alt={label} loading="lazy" className="h-14 w-14 object-contain" />
      <span className="text-xs font-bold capitalize leading-tight text-gray-700">{label}</span>
    </button>
  );
}

function ChainNode({
  stage,
  childrenOf,
  megasOf,
  detail,
  lang,
  onSelect,
  isRoot,
}: {
  stage: EvolutionStage;
  childrenOf: Map<number, EvolutionStage[]>;
  megasOf: (speciesName: string) => FormVariety[];
  detail: PokemonDetail;
  lang: LanguageCode;
  onSelect: (id: number) => void;
  isRoot: boolean;
}) {
  const kids = childrenOf.get(stage.id) ?? [];
  const megas = megasOf(stage.name);
  const stageName = useLocalName('pokemon-species', stage.name, lang);

  return (
    <div className="flex min-w-0 max-w-full flex-wrap items-center justify-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <StageNode
          id={stage.id}
          label={stageName}
          sprite={getSpriteUrl(stage.id)}
          active={stage.id === detail.id}
          onClick={() => onSelect(stage.id)}
        />
        {isRoot && (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            {g(lang, 'base_form')}
          </span>
        )}
      </div>

      {(kids.length > 0 || megas.length > 0) && (
        <div className="flex min-w-0 max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-5">
          {kids.map((kid) => (
            <div key={`${kid.id}-${kid.fromId}`} className="flex min-w-0 max-w-full flex-wrap items-center justify-center">
              <EvoArrow stage={kid} lang={lang} />
              <ChainNode
                stage={kid}
                childrenOf={childrenOf}
                megasOf={megasOf}
                detail={detail}
                lang={lang}
                onSelect={onSelect}
                isRoot={false}
              />
            </div>
          ))}
          {megas.map((mega) => (
            <div key={mega.name} className="flex min-w-0 max-w-full flex-wrap items-center justify-center">
              <Arrow
                text={
                  megaStones[mega.name]
                    ? ''
                    : mega.name.startsWith('rayquaza')
                      ? f(lang, 'dragon_ascent')
                      : f(lang, 'mega_evolves')
                }
                items={[megaStones[mega.name] ?? null]}
                accent="mega"
                lang={lang}
              />
              <StageNode
                id={mega.id}
                label={`${stageName} ${formSuffix(stage.name, mega.name, lang)}`}
                sprite={mega.spriteUrl}
                active={false}
                accent="mega"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Arrow for a regular evolution step (hooks live here so they stay unconditional). */
function EvoArrow({ stage, lang }: { stage: EvolutionStage; lang: LanguageCode }) {
  const text = useRequirementText(stage, lang);
  const isTrade = (stage.trigger ?? '').includes('trade');
  return (
    <Arrow
      text={text}
      items={[stage.item, stage.heldItem]}
      trade={isTrade}
      lang={lang}
    />
  );
}

export default function EvolutionFlow({
  detail,
  species,
  evolution,
  lang,
  onSelect,
}: {
  detail: PokemonDetail;
  species: SpeciesData | null;
  evolution: EvolutionStage[];
  lang: LanguageCode;
  onSelect: (id: number) => void;
}) {
  const [megaForms, setMegaForms] = useState<FormVariety[]>([]);

  const megaNames = useMemo(
    () => (species?.varieties ?? []).filter((v) => categorize(v) === 'mega'),
    [species]
  );

  useEffect(() => {
    let cancelled = false;
    if (megaNames.length === 0) {
      setMegaForms([]);
      return;
    }
    (async () => {
      const results = await Promise.all(
        megaNames.map((n) => fetchFormVariety(n).catch(() => null))
      );
      if (!cancelled) setMegaForms(results.filter((r): r is FormVariety => r !== null));
    })();
    return () => {
      cancelled = true;
    };
  }, [megaNames]);

  const { root, childrenOf } = useMemo(() => {
    const map = new Map<number, EvolutionStage[]>();
    let first: EvolutionStage | null = null;
    for (const stage of evolution) {
      if (stage.fromId === null) {
        if (!first) first = stage;
        continue;
      }
      const bucket = map.get(stage.fromId) ?? [];
      bucket.push(stage);
      map.set(stage.fromId, bucket);
    }
    return { root: first ?? evolution[0] ?? null, childrenOf: map };
  }, [evolution]);

  const megasOf = useMemo(
    () => (speciesName: string) =>
      megaForms.filter((m) => m.name.startsWith(`${speciesName}-`)),
    [megaForms]
  );

  if (!root) return <p className="text-sm text-gray-400">{g(lang, 'evolution_none')}</p>;
  if (evolution.length <= 1 && megaForms.length === 0) {
    return <p className="text-sm text-gray-400">{g(lang, 'evolution_none')}</p>;
  }

  return (
    <div className="w-full overflow-hidden py-1">
      <div className="flex w-full flex-wrap items-center justify-center gap-y-5">
        <ChainNode
          stage={root}
          childrenOf={childrenOf}
          megasOf={megasOf}
          detail={detail}
          lang={lang}
          onSelect={onSelect}
          isRoot
        />
      </div>
    </div>
  );
}
