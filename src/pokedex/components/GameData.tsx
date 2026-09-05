import { useMemo, useState } from 'react';
import type {
  PokemonDetail,
  SpeciesData,
  EvolutionStage,
  EncounterEntry,
  LanguageCode,
} from '@/pokedex/types';
import { typeInfo, statColors } from '@/pokedex/data/typeInfo';
import { getDefensiveProfile } from '@/pokedex/data/typeChart';
import { statLabels } from '@/pokedex/data/translations';
import {
  g, growthLabel, humanize, methodLabel,
} from '@/pokedex/data/gameTranslations';
import { u } from '@/pokedex/data/uiTranslations';
import { placeName } from '@/pokedex/data/placeNames';
import { typeNames } from '@/pokedex/data/translations';
import { useLocalName, useResourceDialog } from './ResourceProvider';
import { eggGroupName } from '@/pokedex/data/eggGroups';
import EvolutionFlow from './EvolutionFlow';
import type { ResourceKind } from '@/pokedex/services/resources';
import {
  ShieldAlert, GitBranch, MapPin, Egg, Dumbbell, ListOrdered,
} from 'lucide-react';




interface GameDataProps {
  detail: PokemonDetail;
  species: SpeciesData | null;
  evolution: EvolutionStage[];
  encounters: EncounterEntry[];
  lang: LanguageCode;
  onSelect: (id: number) => void;
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
      {icon}
      {children}
    </h3>
  );
}

function TypeChip({ type, lang, note }: { type: string; lang: LanguageCode; note?: string }) {
  const info = typeInfo[type] ?? typeInfo['normal']!;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide"
      style={{ backgroundColor: info.color, color: info.textColor }}
    >
      {typeNames[lang]?.[type] ?? info.name}
      {note && <span className="opacity-80">{note}</span>}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-gray-100 py-1.5 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-right text-sm font-semibold text-gray-700">{value}</span>
    </div>
  );
}

function genderText(rate: number, lang: LanguageCode): string {
  if (rate < 0) return g(lang, 'genderless');
  const female = (rate / 8) * 100;
  return `♀ ${female.toFixed(1)}% · ♂ ${(100 - female).toFixed(1)}%`;
}

/** Renders the localized name of a PokéAPI resource as plain text. */
function ResName({
  kind, slug, lang,
}: { kind: ResourceKind; slug: string; lang: LanguageCode }) {
  return <>{useLocalName(kind, slug, lang)}</>;
}

/** Localized, clickable inline resource name. */
function ResLink({
  kind, slug, lang, className,
}: { kind: ResourceKind; slug: string; lang: LanguageCode; className?: string }) {
  const { open } = useResourceDialog();
  const name = useLocalName(kind, slug, lang);
  return (
    <button
      type="button"
      onClick={() => open(kind, slug)}
      className={
        className ??
        'underline decoration-dotted underline-offset-2 transition-colors hover:text-pokedex-red'
      }
    >
      {name}
    </button>
  );
}

/** Encounter method name from PokéAPI, falling back to the built-in dictionary. */
function MethodLabel({ method, lang }: { method: string; lang: LanguageCode }) {
  const apiName = useLocalName('encounter-method', method, lang);
  const local = methodLabel(lang, method);
  // Prefer the built-in dictionary whenever it actually translates the method,
  // because PokeAPI only ships English names for encounter methods.
  if (local !== methodLabel('en', method)) return <>{local}</>;
  return <>{apiName === humanize(method) ? local : apiName}</>;
}

/**
 * Localized encounter location. The resource layer already falls back from the
 * area to its parent location, so we never guess a parent slug here (that used
 * to produce 404s for areas whose slug isn't "<location>-area").
 * PokeAPI has no Italian/Spanish place names, so generic terms are translated.
 */
function LocationName({ slug, lang }: { slug: string; lang: LanguageCode }) {
  const areaName = useLocalName('location-area', slug, lang);
  return <>{placeName(lang, areaName || humanize(slug))}</>;
}

function ResNameList({
  kind, slugs, lang,
}: { kind: ResourceKind; slugs: string[]; lang: LanguageCode }) {
  return (
    <>
      {slugs.map((slug, i) => (
        <span key={slug}>
          {i > 0 && ', '}
          <ResName kind={kind} slug={slug} lang={lang} />
        </span>
      ))}
    </>
  );
}











export default function GameData({
  detail, species, evolution, encounters, lang, onSelect,
}: GameDataProps) {
  const [allLocations, setAllLocations] = useState(false);
  const [allMoves, setAllMoves] = useState(false);

  const availableGens = useMemo(
    () =>
      Object.keys(detail.levelUpByGen ?? {})
        .map(Number)
        .filter((n) => !Number.isNaN(n))
        .sort((a, b) => a - b),
    [detail.levelUpByGen]
  );
  const latestGen = availableGens[availableGens.length - 1] ?? null;
  const [genOverride, setGenOverride] = useState<number | null>(null);
  const selectedGen =
    genOverride !== null && availableGens.includes(genOverride) ? genOverride : latestGen;

  const profile = getDefensiveProfile(detail.types);
  const visibleEncounters = allLocations ? encounters : encounters.slice(0, 6);
  const genMoves =
    selectedGen !== null
      ? (detail.levelUpByGen?.[String(selectedGen)] ?? [])
      : detail.levelUpMoves;
  const levelMoves = genMoves.filter((m) => m.level > 0);
  const visibleMoves = allMoves ? levelMoves : levelMoves.slice(0, 10);


  return (
    <div className="mt-7 space-y-7">
      {/* === Type matchups === */}
      <section>
        <SectionTitle icon={<ShieldAlert size={14} />}>{g(lang, 'defense_chart')}</SectionTitle>
        <div className="space-y-2.5">
          {profile.quadWeak.length > 0 && (
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-red-500">
                {g(lang, 'weak_4x')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.quadWeak.map((tp) => <TypeChip key={tp} type={tp} lang={lang} note="×4" />)}
              </div>
            </div>
          )}
          {profile.weak.length > 0 && (
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-orange-500">
                {g(lang, 'weak_2x')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.weak.map((tp) => <TypeChip key={tp} type={tp} lang={lang} note="×2" />)}
              </div>
            </div>
          )}
          {profile.resist.length > 0 && (
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-green-600">
                {g(lang, 'resist_2x')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.resist.map((tp) => <TypeChip key={tp} type={tp} lang={lang} note="×½" />)}
              </div>
            </div>
          )}
          {profile.quadResist.length > 0 && (
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                {g(lang, 'resist_4x')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.quadResist.map((tp) => <TypeChip key={tp} type={tp} lang={lang} note="×¼" />)}
              </div>
            </div>
          )}
          {profile.immune.length > 0 && (
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                {g(lang, 'immune')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.immune.map((tp) => <TypeChip key={tp} type={tp} lang={lang} note="×0" />)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* === Evolution === */}
      <section>
        <SectionTitle icon={<GitBranch size={14} />}>{g(lang, 'evolution')}</SectionTitle>
        <EvolutionFlow
          detail={detail}
          species={species}
          evolution={evolution}
          lang={lang}
          onSelect={onSelect}
        />
      </section>


      {/* === Locations === */}
      <section>
        <SectionTitle icon={<MapPin size={14} />}>{g(lang, 'locations')}</SectionTitle>
        {encounters.length === 0 ? (
          <p className="text-sm text-gray-400">{g(lang, 'locations_none')}</p>
        ) : (
          <>
            <p className="mb-2 text-xs text-gray-400">{g(lang, 'locations_hint')}</p>
            <div className="space-y-2">
              {visibleEncounters.map((e) => (
                <div key={e.location} className="rounded-xl border border-gray-200 bg-white p-3">
                  <p className="text-sm font-semibold text-gray-700">
                    <LocationName slug={e.location} lang={lang} />
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {e.methods.map((m) => (
                      <span key={m} className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                        <MethodLabel method={m} lang={lang} />
                      </span>
                    ))}
                    {e.maxLevel > 0 && (
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                        {g(lang, 'level')} {e.minLevel}–{e.maxLevel}
                      </span>
                    )}
                    {e.maxChance > 0 && (
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                        {e.maxChance}%
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[11px] text-gray-400">
                    {g(lang, 'versions')}:{' '}
                    <ResNameList kind="version" slugs={e.versions} lang={lang} />
                  </p>

                </div>
              ))}
            </div>
            {encounters.length > 6 && (
              <button
                onClick={() => setAllLocations((v) => !v)}
                className="mt-2 text-xs font-bold uppercase tracking-wide text-pokedex-red hover:underline"
              >
                {allLocations
                  ? g(lang, 'show_less')
                  : `${g(lang, 'show_all')} (+${encounters.length - 6} ${g(lang, 'more_locations')})`}
              </button>
            )}
          </>
        )}
      </section>

      {/* === Breeding + training === */}
      <div className="grid gap-5 sm:grid-cols-2">
        <section>
          <SectionTitle icon={<Egg size={14} />}>{g(lang, 'breeding')}</SectionTitle>
          <div className="rounded-xl border border-gray-200 bg-white px-3 py-1">
            <InfoRow
              label={g(lang, 'egg_groups')}
              value={
                species?.eggGroups.length ? (
                  <span className="inline-flex flex-wrap justify-end gap-1">
                    {species.eggGroups.map((eg) => (
                      <a
                        key={eg}
                        href={`/?eggGroup=${encodeURIComponent(eg)}`}
                        className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-200"
                      >
                        {eggGroupName(lang, eg)}
                      </a>
                    ))}
                  </span>
                ) : (
                  g(lang, 'none')
                )
              }
            />
            <InfoRow
              label={g(lang, 'egg_cycles')}
              value={
                species
                  ? `${species.hatchCounter} (~${(species.hatchCounter + 1) * 255} steps)`
                  : g(lang, 'unknown')
              }
            />
            <InfoRow label={g(lang, 'gender')} value={genderText(species?.genderRate ?? -1, lang)} />
            <InfoRow
              label={g(lang, 'habitat')}
              value={
                species?.habitat ? (
                  <ResName kind="pokemon-habitat" slug={species.habitat} lang={lang} />
                ) : (
                  g(lang, 'unknown')
                )
              }
            />
          </div>
        </section>

        <section>
          <SectionTitle icon={<Dumbbell size={14} />}>{g(lang, 'training')}</SectionTitle>
          <div className="rounded-xl border border-gray-200 bg-white px-3 py-1">
            <InfoRow
              label={g(lang, 'capture_rate')}
              value={
                species
                  ? `${species.captureRate} (${species.captureRate >= 150 ? g(lang, 'catch_easy') : species.captureRate <= 45 ? g(lang, 'catch_hard') : '—'})`
                  : g(lang, 'unknown')
              }
            />
            <InfoRow label={g(lang, 'base_exp')} value={detail.baseExperience || g(lang, 'unknown')} />
            <InfoRow
              label={g(lang, 'ev_yield')}
              value={
                Object.entries(detail.effortYield).length
                  ? Object.entries(detail.effortYield)
                      .map(([k, v]) => `${v} ${statLabels[lang]?.[k] ?? k}`)
                      .join(', ')
                  : g(lang, 'none')
              }
            />
            <InfoRow
              label={g(lang, 'growth_rate')}
              value={species?.growthRate ? growthLabel(lang, species.growthRate) : g(lang, 'unknown')}
            />
            <InfoRow label={g(lang, 'base_happiness')} value={species?.baseHappiness ?? g(lang, 'unknown')} />
            <InfoRow
              label={g(lang, 'held_items')}
              value={
                detail.heldItems.length ? (
                  <span className="inline-flex flex-wrap justify-end gap-x-1">
                    {detail.heldItems.map((h, i) => (
                      <span key={h}>
                        {i > 0 && ', '}
                        <ResLink kind="item" slug={h} lang={lang} />
                      </span>
                    ))}
                  </span>
                ) : (
                  g(lang, 'none')
                )
              }
            />
          </div>
        </section>
      </div>

      {/* === Level-up learnset === */}
      {availableGens.length > 0 && (
        <section>
          <SectionTitle icon={<ListOrdered size={14} />}>{g(lang, 'learnset')}</SectionTitle>

          {/* Generation selector */}
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">
              {u(lang, 'generation')}
            </span>
            {availableGens.map((gen) => (
              <button
                key={gen}
                onClick={() => {
                  setGenOverride(gen);
                  setAllMoves(false);
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all active:scale-95 ${
                  selectedGen === gen
                    ? 'bg-pokedex-red text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {u(lang, 'gen_short')} {gen}
              </button>
            ))}
          </div>

          {levelMoves.length === 0 ? (
            <p className="text-sm text-gray-400">{u(lang, 'no_moves_gen')}</p>
          ) : (
            <>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {visibleMoves.map((m) => (
                  <MoveLevelRow key={m.move} slug={m.move} level={m.level} lang={lang} />
                ))}
              </div>
              {levelMoves.length > 10 && (
                <button
                  onClick={() => setAllMoves((v) => !v)}
                  className="mt-2 text-xs font-bold uppercase tracking-wide text-pokedex-red hover:underline"
                >
                  {allMoves ? g(lang, 'show_less') : `${g(lang, 'show_all')} (${levelMoves.length})`}
                </button>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}

function MoveLevelRow({
  slug, level, lang,
}: { slug: string; level: number; lang: LanguageCode }) {
  const { open } = useResourceDialog();
  const name = useLocalName('move', slug, lang);

  return (
    <button
      type="button"
      onClick={() => open('move', slug)}
      className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-1.5 text-left transition-all hover:bg-gray-100 active:scale-[0.99]"
    >
      <span className="truncate text-sm text-gray-700">{name}</span>
      <span
        className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-bold text-white"
        style={{ backgroundColor: statColors['speed'] }}
      >
        {g(lang, 'level')} {level}
      </span>
    </button>
  );
}

