import { useMemo, useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, SlidersHorizontal, ChevronDown } from 'lucide-react';
import type { PokemonListEntry, LanguageCode } from '@/pokedex/types';
import { typeInfo, allTypes } from '@/pokedex/data/typeInfo';
import { regions } from '@/pokedex/data/regions';
import { t, regionNames, typeNames } from '@/pokedex/data/translations';
import { getArtworkUrl, fetchEggGroupSpecies } from '@/pokedex/services/pokeapi';
import { allEggGroups, eggGroupName, e as et } from '@/pokedex/data/eggGroups';
import TypeBadge from './TypeBadge';

interface PokemonListProps {
  pokemon: PokemonListEntry[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  lang: LanguageCode;
  loading: boolean;
  initialEggGroup?: string | undefined;
  initialType?: string | undefined;
  onEggGroupFilterChange?: (value: string | null) => void;
  onTypeFilterChange?: (value: string | null) => void;
}

function readRouteFilter(key: 'type' | 'eggGroup', fallback?: string): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.has(key) ? params.get(key) || null : fallback ?? null;
}

function updateRouteFilter(
  key: 'type' | 'eggGroup',
  value: string | null,
  clearSelectedPokemon = false,
) {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(key, value);
  } else {
    url.searchParams.delete(key);
  }
  if (clearSelectedPokemon) {
    url.searchParams.delete('pokemon');
  }
  window.history.replaceState(
    window.history.state,
    '',
    `${url.pathname}${url.search}${url.hash}`,
  );
}

export default function PokemonList({
  pokemon,
  selectedId,
  onSelect,
  lang,
  loading,
  initialEggGroup,
  initialType,
  onEggGroupFilterChange,
  onTypeFilterChange,
}: PokemonListProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(() => readRouteFilter('type', initialType));
  const [genFilter, setGenFilter] = useState<number | null>(null);
  const [eggFilter, setEggFilter] = useState<string | null>(() => readRouteFilter('eggGroup', initialEggGroup));
  const [eggIds, setEggIds] = useState<number[] | null>(null);
  const [eggLoading, setEggLoading] = useState(Boolean(initialEggGroup));
  const [visibleCount, setVisibleCount] = useState(60);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialType !== undefined) {
      setTypeFilter(initialType);
    }
  }, [initialType]);

  useEffect(() => {
    if (initialEggGroup !== undefined) {
      setEggFilter(initialEggGroup);
    }
  }, [initialEggGroup]);

  useEffect(() => {
    let cancelled = false;
    if (!eggFilter) {
      setEggIds(null);
      setEggLoading(false);
      return undefined;
    }
    setEggLoading(true);
    fetchEggGroupSpecies(eggFilter)
      .then((ids) => {
        if (!cancelled) {
          setEggIds(ids);
          setEggLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEggIds([]);
          setEggLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [eggFilter]);

  const eggSet = useMemo(() => (eggIds ? new Set(eggIds) : null), [eggIds]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return pokemon.filter((p) => {
      const matchesSearch =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        String(p.id).padStart(4, '0').includes(q);
      const matchesType = typeFilter === null || p.types.includes(typeFilter);
      const matchesGen = genFilter === null || p.generation === genFilter;
      const matchesEgg = eggFilter === null || (eggSet !== null && eggSet.has(p.id));
      return matchesSearch && matchesType && matchesGen && matchesEgg;
    });
  }, [pokemon, search, typeFilter, genFilter, eggFilter, eggSet]);

  const visible = filtered.slice(0, visibleCount);
  const activeFilterCount = (typeFilter ? 1 : 0) + (genFilter ? 1 : 0) + (eggFilter ? 1 : 0);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (!filterOpen) return undefined;
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 200) {
      setVisibleCount((c) => Math.min(c + 40, filtered.length));
    }
  };

  const clearFilters = () => {
    setTypeFilter(null);
    setGenFilter(null);
    setEggFilter(null);
    onTypeFilterChange?.(null);
    onEggGroupFilterChange?.(null);
    updateRouteFilter('type', null);
    updateRouteFilter('eggGroup', null);
    setVisibleCount(60);
  };

  const handleTypeBadgeClick = (type: string) => {
    setTypeFilter(type);
    onTypeFilterChange?.(type);
    updateRouteFilter('type', type, true);
    setVisibleCount(60);
  };

  return (
    <div className="flex h-full flex-col bg-[#edf6f6] text-[#17324d]">
      {/* Search bar + filter button */}
      <div className="p-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#557084]"
            />
            <input
              data-testid="input-pokemon-search"
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(60);
              }}
              placeholder={t(lang, 'search_placeholder')}
              className="w-full rounded-xl border border-[#c8dddf] bg-white/80 py-2.5 pl-10 pr-10 text-sm text-[#17324d] placeholder-[#557084]/70 outline-none transition-all focus:border-[#36a9b8] focus:bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#557084] transition-colors hover:text-[#17324d]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter button */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className={`flex h-[42px] items-center gap-1.5 rounded-xl border-2 px-3 text-sm font-semibold transition-all ${
                filterOpen || activeFilterCount > 0
                   ? 'border-[#36a9b8] bg-[#d9f0f0] text-[#17324d]'
                   : 'border-[#c8dddf] bg-white/70 text-[#557084] hover:bg-white'
              }`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">{t(lang, 'filter')}</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-pokedex-yellow px-1 text-xs font-bold text-gray-900">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown size={14} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter dropdown */}
            {filterOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-72 max-h-[60vh] overflow-y-auto rounded-xl border border-gray-200 bg-white p-3 shadow-2xl pokeball-scroll">
                {/* Region filter */}
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                  {t(lang, 'region_filter')}
                </p>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => { setGenFilter(null); setVisibleCount(60); }}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                      genFilter === null
                        ? 'bg-pokedex-red text-white shadow'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t(lang, 'all')}
                  </button>
                  {regions.map((r) => {
                    const active = genFilter === r.gen;
                    return (
                      <button
                        key={r.id}
                        onClick={() => { setGenFilter(active ? null : r.gen); setVisibleCount(60); }}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                          active
                            ? 'bg-pokedex-yellow text-gray-900 shadow'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {regionNames[lang]?.[r.id] ?? r.id}
                      </button>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="my-3 border-t border-gray-100" />

                {/* Type filter */}
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                  {t(lang, 'type_filter')}
                </p>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => {
                      setTypeFilter(null);
                      onTypeFilterChange?.(null);
                      updateRouteFilter('type', null);
                      setVisibleCount(60);
                    }}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                      typeFilter === null
                        ? 'bg-pokedex-red text-white shadow'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t(lang, 'all')}
                  </button>
                  {allTypes.map((tp) => {
                    const info = typeInfo[tp]!;
                    const active = typeFilter === tp;
                    return (
                      <button
                        key={tp}
                        onClick={() => {
                          const nextType = active ? null : tp;
                          setTypeFilter(nextType);
                          onTypeFilterChange?.(nextType);
                          updateRouteFilter('type', nextType);
                          setVisibleCount(60);
                        }}
                        className="rounded-full px-2.5 py-1 text-xs font-semibold transition-all hover:scale-105"
                        style={{
                          backgroundColor: active ? info.color : '#f3f4f6',
                          color: active ? info.textColor : '#4b5563',
                        }}
                      >
                        {typeNames[lang]?.[tp] ?? tp}
                      </button>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="my-3 border-t border-gray-100" />

                {/* Egg group filter */}
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                  {et(lang, 'egg_group_filter')}
                </p>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => {
                      setEggFilter(null);
                      onEggGroupFilterChange?.(null);
                      updateRouteFilter('eggGroup', null);
                      setVisibleCount(60);
                    }}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                      eggFilter === null
                        ? 'bg-pokedex-red text-white shadow'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t(lang, 'all')}
                  </button>
                  {allEggGroups.map((eg) => {
                    const active = eggFilter === eg;
                    return (
                      <button
                        key={eg}
                        onClick={() => {
                          const nextEggGroup = active ? null : eg;
                          setEggFilter(nextEggGroup);
                          onEggGroupFilterChange?.(nextEggGroup);
                          updateRouteFilter('eggGroup', nextEggGroup);
                          setVisibleCount(60);
                        }}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                          active
                            ? 'bg-emerald-500 text-white shadow'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {eggGroupName(lang, eg)}
                      </button>
                    );
                  })}
                </div>

                {/* Clear filters */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 w-full rounded-lg bg-gray-100 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    {t(lang, 'clear_filters')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 pokeball-scroll" onScroll={handleScroll}>
        {loading ? (
          <div className="grid grid-cols-2 gap-2.5 px-1 py-2" aria-label={t(lang, 'loading_list')}>
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="flex h-[174px] flex-col gap-2 rounded-2xl border border-white/50 bg-white/45 p-2.5">
                <div className="h-3 w-1/3 animate-pulse rounded-full bg-[#c8dddf]" />
                <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-white/70" />
                <div className="mt-auto space-y-2">
                  <div className="h-3 w-4/5 animate-pulse rounded-full bg-[#c8dddf]" />
                  <div className="h-2.5 w-3/5 animate-pulse rounded-full bg-[#d8e8e9]" />
                </div>
              </div>
            ))}
          </div>
        ) : eggLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#557084]/70">
            <Loader2 size={32} className="mb-2 animate-spin opacity-70" />
            <p className="text-sm">{t(lang, 'loading_list')}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#557084]/70">
            <Search size={32} className="mb-2 opacity-50" />
            <p className="text-sm">{t(lang, 'no_results')}</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-2.5">
            {visible.map((p) => {
              return (
                <li key={p.id}>
                  <button
                    onClick={() => onSelect(p.id)}
                    aria-current={p.id === selectedId ? 'true' : undefined}
                    className="group relative flex h-[174px] w-full flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/65 p-2.5 text-left text-[#29475b] shadow-[0_4px_14px_rgba(23,50,77,0.06)] transition-[border-color,background-color,box-shadow] duration-200 hover:border-[#9ecdd1] hover:bg-white hover:shadow-[0_12px_22px_rgba(23,50,77,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36a9b8] focus-visible:ring-offset-1"
                  >
                    <span className="flex items-center justify-between pt-0.5">
                      <span className="pokemon-number">#{String(p.id).padStart(4, '0')}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#36a9b8]/60 transition-all duration-200 group-hover:scale-150 group-hover:bg-[#df5a4d]" />
                    </span>

                    <span className="flex h-[72px] shrink-0 items-center justify-center">
                      <img
                        src={getArtworkUrl(p.id)}
                        alt={p.name}
                        className="pokemon-card-art h-[80px] w-[80px] object-contain drop-shadow-[0_8px_6px_rgba(23,50,77,0.16)] transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-2"
                        loading="lazy"
                      />
                    </span>
                    <div className="mt-auto min-w-0">
                      <p className="h-5 truncate text-center text-sm font-bold leading-5 capitalize text-[#17324d]">{p.name}</p>
                      
                      {/* Contenitore dei tipi corretto in orizzontale */}
                     <div className="mt-1.5 flex flex-row flex-wrap items-center justify-center gap-0.5">
                        {p.types.map((tp) => (
                          <TypeBadge
                            key={tp}
                            type={tp}
                            size="sm"
                            lang={lang}
                            asLink={false}
                            onClick={() => handleTypeBadgeClick(tp)}
                          />
                        ))}
                      </div>

                    </div>
                  </button>
                </li>
              );
            })}
            {visibleCount < filtered.length && (
              <li className="flex items-center justify-center py-3 text-[#557084]/60">
                <Loader2 size={16} className="mr-1.5 animate-spin" />
                <span className="text-xs">...</span>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
