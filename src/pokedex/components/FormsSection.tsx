import { useEffect, useMemo, useState } from 'react';
import type { PokemonDetail, SpeciesData, LanguageCode, PokemonStats } from '@/pokedex/types';
import { fetchFormVariety, type FormVariety } from '@/pokedex/services/pokeapi';
import { megaStones } from '@/pokedex/data/megaStones';
import { f, categorize, regionOf, formSuffix, type FormCategory } from '@/pokedex/data/formLabels';
import { statLabels } from '@/pokedex/data/translations';
import { statColors, typeInfo } from '@/pokedex/data/typeInfo';
import { typeNames } from '@/pokedex/data/translations';
import { getDefensiveProfile } from '@/pokedex/data/typeChart';

import TypeBadge from './TypeBadge';
import { EntityChip } from './ResourceProvider';
import { Sparkles, Globe2, Shapes } from 'lucide-react';

const statKeys = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'] as const;

function total(stats: PokemonStats): number {
  return statKeys.reduce((sum, k) => sum + stats[k], 0);
}

function FormCard({
  form,
  base,
  speciesSlug,
  lang,
}: {
  form: FormVariety;
  base: PokemonDetail;
  speciesSlug: string;
  lang: LanguageCode;
}) {
  const stone = megaStones[form.name];
  const isMega = categorize(form.name) === 'mega';
  const region = regionOf(form.name);
  const baseTotal = total(base.stats);
  const formTotal = total(form.stats);
  const diff = formTotal - baseTotal;

  return (
    <div className="rounded-2xl border border-[#d6e2e3] bg-[#fbfcf8] p-4 shadow-[0_8px_20px_rgba(23,50,77,0.06)]">
      <div className="flex items-start gap-3">
        <img
          src={form.artworkUrl}
          alt={form.name}
          loading="lazy"
          className="h-20 w-20 shrink-0 object-contain"
          onError={(ev) => {
            (ev.currentTarget as HTMLImageElement).src = form.spriteUrl;
          }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black capitalize text-gray-800">
              {formSuffix(speciesSlug, form.name, lang)}
            </p>
            {region && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                {f(lang, region)}
              </span>
            )}
            {isMega && (
              <span className="rounded-full bg-fuchsia-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fuchsia-700">
                Mega
              </span>
            )}
          </div>

          <div className="type-badge-cluster mt-2">
            {form.types.map((tp) => (
              <TypeBadge key={tp} type={tp} lang={lang} />
            ))}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {form.abilities.map((a) => (
              <EntityChip
                key={a}
                kind="ability"
                slug={a}
                lang={lang}
                className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600 transition-all hover:bg-gray-200 active:scale-95"
              />
            ))}
          </div>

          {isMega && (
            <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
              <span>{f(lang, 'requires')}:</span>
              {stone ? (
                <EntityChip
                  kind="item"
                  slug={stone}
                  lang={lang}
                  className="rounded-md bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700 transition-all hover:bg-amber-100 active:scale-95"
                />
              ) : (
                <span className="font-semibold text-gray-600">
                  {form.name.startsWith('rayquaza') ? f(lang, 'dragon_ascent') : f(lang, 'no_stone')}
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Stats vs base form */}
      <div className="mt-3 space-y-1">
        {statKeys.map((k) => {
          const v = form.stats[k];
          const d = v - base.stats[k];
          return (
            <div key={k} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-[10px] font-medium uppercase text-gray-400">
                {statLabels[lang]?.[k] ?? k}
              </span>
              <span className="w-8 shrink-0 text-right text-[11px] font-bold tabular-nums text-gray-700">
                {v}
              </span>
                 <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e2ebeb]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min((v / 255) * 100, 100)}%`, backgroundColor: statColors[k] }}
                />
              </div>
              <span
                className={`w-10 shrink-0 text-right text-[10px] font-bold tabular-nums ${
                  d > 0 ? 'text-emerald-600' : d < 0 ? 'text-red-500' : 'text-gray-300'
                }`}
              >
                {d > 0 ? `+${d}` : d < 0 ? d : '—'}
              </span>
            </div>
          );
        })}
        <div className="flex items-center justify-between border-t border-gray-100 pt-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {f(lang, 'total')}
          </span>
          <span className="text-xs font-black tabular-nums text-gray-700">
            {formTotal}
            <span
              className={`ml-1.5 text-[10px] ${
                diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-red-500' : 'text-gray-300'
              }`}
            >
              {diff > 0 ? `+${diff}` : diff < 0 ? diff : ''}
            </span>
          </span>
        </div>
      </div>

      <FormPeculiarities form={form} base={base} lang={lang} />
    </div>
  );
}

/** Type matchups of the form (with what changed vs the base) plus exclusive moves. */
function FormPeculiarities({
  form,
  base,
  lang,
}: {
  form: FormVariety;
  base: PokemonDetail;
  lang: LanguageCode;
}) {
  const profile = useMemo(() => getDefensiveProfile(form.types), [form.types]);
  const baseProfile = useMemo(() => getDefensiveProfile(base.types), [base.types]);

  const uniqueMoves = useMemo(() => {
    const known = new Set(base.moves);
    return form.moves.filter((m) => !known.has(m)).slice(0, 8);
  }, [form.moves, base.moves]);

  const rows: { label: string; types: string[]; baseTypes: string[]; tone: string }[] = [
    {
      label: f(lang, 'weak_to'),
      types: [...profile.quadWeak, ...profile.weak],
      baseTypes: [...baseProfile.quadWeak, ...baseProfile.weak],
      tone: 'text-red-500',
    },
    {
      label: f(lang, 'resists'),
      types: [...profile.quadResist, ...profile.resist],
      baseTypes: [...baseProfile.quadResist, ...baseProfile.resist],
      tone: 'text-emerald-600',
    },
    {
      label: f(lang, 'immune_to'),
      types: profile.immune,
      baseTypes: baseProfile.immune,
      tone: 'text-gray-500',
    },
  ].filter((r) => r.types.length > 0);

  if (rows.length === 0 && uniqueMoves.length === 0) return null;

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {f(lang, 'peculiarities')}
      </p>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label}>
            <p className={`mb-1 text-[10px] font-bold uppercase tracking-wide ${row.tone}`}>
              {row.label}
            </p>
            <div className="flex flex-wrap gap-1">
              {row.types.map((tp) => {
                const isNew = !row.baseTypes.includes(tp);
                const info = typeInfo[tp] ?? typeInfo['normal']!;
                return (
                  <span
                    key={tp}
                    title={isNew ? f(lang, 'changed') : undefined}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                      isNew ? 'ring-2 ring-amber-400' : ''
                    }`}
                    style={{ backgroundColor: info.color, color: info.textColor }}
                  >
                    {typeNames[lang]?.[tp] ?? info.name}
                  </span>
                );
              })}
            </div>
          </div>
        ))}

        {uniqueMoves.length > 0 && (
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-indigo-500">
              {f(lang, 'unique_moves')}
            </p>
            <div className="flex flex-wrap gap-1">
              {uniqueMoves.map((m) => (
                <EntityChip
                  key={m}
                  kind="move"
                  slug={m}
                  lang={lang}
                  className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 transition-all hover:bg-indigo-100 active:scale-95"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default function FormsSection({
  detail,
  species,
  lang,
}: {
  detail: PokemonDetail;
  species: SpeciesData | null;
  lang: LanguageCode;
}) {
  const [forms, setForms] = useState<FormVariety[]>([]);
  const [loading, setLoading] = useState(false);

  const speciesSlug = useMemo(() => {
    const first = species?.varieties?.[0];
    return first ?? detail.name;
  }, [species, detail.name]);

  const alternates = useMemo(
    () => (species?.varieties ?? []).filter((v) => v !== speciesSlug),
    [species, speciesSlug]
  );

  useEffect(() => {
    let cancelled = false;
    if (alternates.length === 0) {
      setForms([]);
      return;
    }
    setLoading(true);
    (async () => {
      const results = await Promise.all(
        alternates.map((name) => fetchFormVariety(name).catch(() => null))
      );
      if (cancelled) return;
      setForms(results.filter((r): r is FormVariety => r !== null));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [alternates]);

  const groups = useMemo(() => {
    const g: Record<FormCategory, FormVariety[]> = { mega: [], regional: [], other: [] };
    for (const form of forms) g[categorize(form.name)].push(form);
    return g;
  }, [forms]);

  if (alternates.length === 0) return null;

  const sections: { key: FormCategory; label: string; icon: typeof Sparkles }[] = [
    { key: 'mega', label: f(lang, 'mega_section'), icon: Sparkles },
    { key: 'regional', label: f(lang, 'regional_section'), icon: Globe2 },
    { key: 'other', label: f(lang, 'other_section'), icon: Shapes },
  ];

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
        {f(lang, 'forms_title')}
      </h3>

      {loading && forms.length === 0 ? (
        <div className="grid gap-3 sm:grid-cols-2" aria-label={f(lang, 'forms_loading')}>
          {[0, 1].map((item) => (
            <div key={item} className="h-44 animate-pulse rounded-2xl border border-gray-100 bg-gray-50" />
          ))}
        </div>
      ) : forms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#cbdcdd] bg-[#f4f8f7] px-4 py-6 text-center">
          <p className="text-sm font-medium text-[#557084]">{f(lang, 'forms_none')}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {sections.map(({ key, label, icon: Icon }) =>
            groups[key].length === 0 ? null : (
              <div key={key}>
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <Icon size={13} />
                  {label}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {groups[key].map((form) => (
                    <FormCard
                      key={form.name}
                      form={form}
                      base={detail}
                      speciesSlug={speciesSlug}
                      lang={lang}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
