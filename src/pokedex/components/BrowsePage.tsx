import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Loader2, AlertCircle, Egg } from 'lucide-react';
import type { LanguageCode, PokemonListEntry } from '@/pokedex/types';
import { fetchPokemonList, fetchEggGroupSpecies, getSpriteUrl } from '@/pokedex/services/pokeapi';
import { typeInfo } from '@/pokedex/data/typeInfo';
import { typeNames } from '@/pokedex/data/translations';
import { e as et, eggGroupName } from '@/pokedex/data/eggGroups';
import { ResourceProvider } from './ResourceProvider';
import TypeBadge from './TypeBadge';

const LANG_KEY = 'pokedex_lang';
const SUPPORTED_LANGS: LanguageCode[] = ['it', 'en', 'es', 'fr', 'de', 'ja'];

function detectLang(): LanguageCode {
  try {
    const stored = localStorage.getItem(LANG_KEY) as LanguageCode | null;
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  } catch {
    // ignore
  }
  const browser = navigator.language.slice(0, 2) as LanguageCode;
  return SUPPORTED_LANGS.includes(browser) ? browser : 'it';
}

interface BrowsePageProps {
  kind: 'type' | 'egg';
  value: string;
}

export default function BrowsePage({ kind, value }: BrowsePageProps) {
  const [lang, setLang] = useState<LanguageCode>('it');
  const [list, setList] = useState<PokemonListEntry[]>([]);
  const [eggIds, setEggIds] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLang(detectLang());
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const [entries, ids] = await Promise.all([
          fetchPokemonList(),
          kind === 'egg' ? fetchEggGroupSpecies(value) : Promise.resolve(null),
        ]);
        if (cancelled) return;
        setList(entries);
        setEggIds(ids);
        setLoading(false);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [kind, value]);

  const results = useMemo(() => {
    if (kind === 'type') return list.filter((p) => p.types.includes(value));
    const set = new Set(eggIds ?? []);
    return list.filter((p) => set.has(p.id));
  }, [kind, value, list, eggIds]);

  const info = typeInfo[value];
  const title =
    kind === 'type'
      ? `${et(lang, 'browse_type')} ${typeNames[lang]?.[value] ?? info?.name ?? value}`
      : `${et(lang, 'browse_egg')}: ${eggGroupName(lang, value)}`;

  return (
    <ResourceProvider lang={lang}>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-8">
          <div className="overflow-hidden rounded-[2rem] border-4 border-gray-700 bg-pokedex-red shadow-2xl">
            <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-8 sm:py-5">
              <a
                href="/"
                className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/25"
              >
                <ChevronLeft size={14} />
                {et(lang, 'back')}
              </a>
              <h1 className="flex items-center gap-2 text-center text-base font-black tracking-wide text-white drop-shadow sm:text-2xl">
                {kind === 'egg' && <Egg size={18} />}
                {title}
              </h1>
              <span className="hidden text-xs font-semibold text-white/70 sm:block">
                {results.length} {et(lang, 'results')}
              </span>
            </div>

            <div className="screen-glow bg-gray-900 p-3 sm:p-4">
              <div className="overflow-hidden rounded-2xl border-4 border-gray-700 bg-gray-50 shadow-inner">
                <div className="h-[70vh] overflow-y-auto p-4 sm:h-[75vh] sm:p-6 pokeball-scroll">
                  {loading ? (
                    <div className="flex h-full flex-col items-center justify-center text-gray-400">
                      <Loader2 size={28} className="mb-2 animate-spin" />
                      <p className="text-sm">{et(lang, 'loading')}</p>
                    </div>
                  ) : error ? (
                    <div className="flex h-full flex-col items-center justify-center text-gray-400">
                      <AlertCircle size={32} className="mb-2 text-red-400" />
                      <p className="text-sm">404</p>
                    </div>
                  ) : (
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {results.map((p) => (
                        <li key={p.id}>
                          <a
                            href={`/?pokemon=${p.id}`}
                            className="flex h-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                          >
                            <img
                              src={getSpriteUrl(p.id)}
                              alt={p.name}
                              loading="lazy"
                              className="h-16 w-16 object-contain"
                            />
                            <span className="pokemon-number">
                              #{String(p.id).padStart(4, '0')}
                            </span>
                            <span className="truncate text-sm font-semibold capitalize text-gray-800">
                              {p.name}
                            </span>
                            <span className="type-badge-cluster mt-1.5 justify-center">
                              {p.types.map((tp) => (
                                <TypeBadge key={tp} type={tp} size="sm" lang={lang} asLink={false} />
                              ))}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 py-2 text-right text-xs font-medium uppercase tracking-widest text-white/60 sm:px-8">
              {results.length} {et(lang, 'results')}
            </div>
          </div>
        </div>
      </div>
    </ResourceProvider>
  );
}
