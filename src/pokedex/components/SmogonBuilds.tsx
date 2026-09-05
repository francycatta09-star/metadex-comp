import type { SmogonBuild, LanguageCode, PokemonStats } from '@/pokedex/types';
import { statLabels, t } from '@/pokedex/data/translations';
import { g, natureEffectWordsFor, natureInfo, roleLabel } from '@/pokedex/data/gameTranslations';
import { EntityChip } from './ResourceProvider';
import { slugify } from '@/pokedex/services/resources';
import { formSuffix } from '@/pokedex/data/formLabels';
import {
  Swords, Sparkles, Package, Dna, Activity, BookOpen, Target, Gauge, Info,
} from 'lucide-react';

interface SmogonBuildsProps {
  builds: SmogonBuild[];
  pokemonName: string;
  lang: LanguageCode;
}

const statOrder: (keyof PokemonStats)[] = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];

export default function SmogonBuilds({ builds, pokemonName, lang }: SmogonBuildsProps) {
  const effectWords = natureEffectWordsFor(lang);

  if (builds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
        <BookOpen size={32} className="mb-3 text-gray-300" />
        <p className="text-sm font-medium text-gray-400">
          {t(lang, 'no_builds')} {pokemonName}
        </p>
        <p className="mt-1 text-xs text-gray-300">{t(lang, 'no_builds_hint')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {builds.map((build, idx) => (
        <div
          key={idx}
          data-testid={`card-build-${build.formName ?? 'base'}-${idx}`}
          className="overflow-hidden rounded-2xl border border-[#d6e2e3] bg-[#fbfcf8] shadow-[0_10px_24px_rgba(23,50,77,0.07)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(23,50,77,0.12)]"
        >
          {/* Format badge header */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#17324d] px-5 py-3">
            <div className="flex items-center gap-2">
                <Swords size={16} className="text-[#f5c969]" />
              <div>
                <span className="block text-sm font-bold uppercase tracking-wider text-white">
                  {t(lang, 'format')} {build.format}
                </span>
                {build.formName && (
                  <span className="mt-0.5 block text-[11px] font-medium capitalize text-white/65">
                    {formSuffix(build.formName.split('-')[0] ?? '', build.formName, lang)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {build.role && (
                  <span className="rounded-full bg-[#36a9b8]/20 px-2.5 py-0.5 text-xs font-semibold text-[#a7e4e5]">
                  {roleLabel(lang, build.role)}
                </span>
              )}
              <span className="rounded-full bg-[#f5c969]/20 px-2.5 py-0.5 text-xs font-bold text-[#f5c969]">
                {build.generated ? g(lang, 'source_derived') : g(lang, 'source_smogon')}
              </span>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            {/* Left column: ability, item, nature */}
            <div className="space-y-3">
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <Dna size={12} />
                  {t(lang, 'ability')}
                </p>
                <EntityChip
                  kind="ability"
                  slug={slugify(build.ability)}
                  lang={lang}
                  className="inline-block rounded-lg bg-purple-50 px-3 py-1.5 text-sm font-semibold text-purple-700 transition-all hover:bg-purple-100 active:scale-95"
                />
              </div>
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <Package size={12} />
                  {t(lang, 'item')}
                </p>
                <EntityChip
                  kind="item"
                  slug={slugify(build.item)}
                  lang={lang}
                  className="inline-block rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 transition-all hover:bg-amber-100 active:scale-95"
                />
              </div>
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <Sparkles size={12} />
                  {t(lang, 'nature')}
                </p>
                {(() => {
                  const nature = natureInfo(lang, build.nature);
                  return (
                    <div className="space-y-1.5">
                      <span className="inline-block rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                        {nature.name}
                      </span>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium">
                        {nature.increased && (
                          <span className="text-emerald-700">
                            ↑ {effectWords.increases}: {nature.increased}
                          </span>
                        )}
                        {nature.decreased && (
                          <span className="text-red-600">
                            ↓ {effectWords.decreases}: {nature.decreased}
                          </span>
                        )}
                        {!nature.increased && !nature.decreased && (
                          <span className="text-gray-500">{nature.neutral}</span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Right column: EVs + IVs */}
            <div className="space-y-3">
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <Activity size={12} />
                  {t(lang, 'evs')}
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {statOrder
                    .filter((s) => (build.evs[s] ?? 0) > 0)
                    .map((s) => (
                      <div
                        key={s}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-2.5 py-1"
                      >
                        <span className="text-xs text-gray-500">{statLabels[lang]?.[s] ?? s}</span>
                        <span className="text-xs font-bold tabular-nums text-gray-700">
                          {build.evs[s]}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {build.ivs && (
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                    <Gauge size={12} />
                    {g(lang, 'ivs')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {statOrder.map((s) => {
                      const value = build.ivs?.[s] ?? 31;
                      return (
                        <span
                          key={s}
                          className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                            value === 31 ? 'bg-gray-100 text-gray-500' : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {statLabels[lang]?.[s] ?? s} {value}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Moves */}
          <div className="border-t border-[#e2ebeb] px-5 py-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
              <Target size={12} />
              {t(lang, 'moves')}
            </p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {build.moves.map((move) => (
                <EntityChip
                  key={move}
                  kind="move"
                  slug={slugify(move)}
                  lang={lang}
                   className="flex items-center gap-2 rounded-lg bg-[#edf5f4] px-3 py-1.5 text-left text-sm font-medium text-[#29475b] transition-all hover:bg-[#dceceb] active:scale-[0.99]"
                  suffix={null}
                />
              ))}
            </div>
          </div>

          {/* Usage notes */}
          {build.description && (
            <div className="border-t border-[#e2ebeb] bg-[#f1f7f5] px-5 py-4">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                <Info size={12} />
                {g(lang, 'notes')}
              </p>
              <p className="text-sm leading-relaxed text-gray-600">{build.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
