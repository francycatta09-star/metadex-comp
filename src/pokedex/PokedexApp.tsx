import { useState, useMemo, useEffect, useCallback } from 'react';
import type {
  PokemonListEntry,
  PokemonDetail as PokemonDetailType,
  SpeciesData,
  EvolutionStage,
  EncounterEntry,
  LanguageCode,
} from '@/pokedex/types';
import {
  fetchPokemonList,
  fetchPokemonDetail,
  fetchSpeciesData,
  fetchEvolutionChain,
  fetchEncounters,
  fetchFormVariety,
  type FormVariety,
} from '@/pokedex/services/pokeapi';
import { smogonBuilds } from '@/pokedex/data/smogonBuilds';
import {
  generateAlternativeBuilds,
  generateBuild,
  normalizeCuratedBuild,
} from '@/pokedex/data/buildGenerator';
import { roleNote } from '@/pokedex/data/gameTranslations';
import { categorize } from '@/pokedex/data/formLabels';
import { megaStones } from '@/pokedex/data/megaStones';

import { t } from '@/pokedex/data/translations';
import PokemonList from '@/pokedex/components/PokemonList';
import PokemonDetail from '@/pokedex/components/PokemonDetail';
import GameData from '@/pokedex/components/GameData';
import FormsSection from '@/pokedex/components/FormsSection';
import SmogonBuilds from '@/pokedex/components/SmogonBuilds';
import LanguageSelector from '@/pokedex/components/LanguageSelector';
import { ResourceProvider } from '@/pokedex/components/ResourceProvider';
import MovesSection from '@/pokedex/components/MovesSection';
import ItemsSection from '@/pokedex/components/ItemsSection';
import { u } from '@/pokedex/data/uiTranslations';
import { BookOpen, ChevronLeft, AlertCircle } from 'lucide-react';

type Tab = 'stats' | 'builds';
type Section = 'pokedex' | 'moves' | 'items';

const LANG_KEY = 'pokedex_lang';

const SUPPORTED_LANGS: LanguageCode[] = ['it', 'en', 'es', 'fr', 'de', 'ja'];

function isFormSetDescription(description: string): boolean {
  return /\bmega\b|megaevol|alola|galar|hisui|paldea/i.test(description);
}

function curatedBuildMatchesForm(
  build: (typeof smogonBuilds)[number],
  form: FormVariety
): boolean {
  const text = `${build.description} ${build.item}`.toLowerCase();
  if (form.name.includes('-mega') || form.name.endsWith('-primal')) {
    const stone = megaStones[form.name]?.replace(/-/g, '');
    if (stone) return build.item.toLowerCase().replace(/[^a-z]/g, '') === stone;
    const base = form.name.split('-')[0];
    return new RegExp(`mega\\s+${base}`, 'i').test(text) || /primal/i.test(text);
  }
  const region = ['alola', 'galar', 'hisui', 'paldea'].find((name) => form.name.includes(`-${name}`));
  return Boolean(region && text.includes(region));
}

/** Runs only in the browser (inside an effect) so SSR and hydration match. */
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

interface PokedexAppProps {
  initialId?: number | undefined;
  initialEggGroup?: string | undefined;
  initialType?: string | undefined;
}

export default function App({ initialId, initialEggGroup, initialType }: PokedexAppProps = {}) {
  const [lang, setLang] = useState<LanguageCode>('it');
  const [pokemonList, setPokemonList] = useState<PokemonListEntry[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(false);

  const [selectedId, setSelectedId] = useState<number>(initialId ?? 25);
  const [routeType, setRouteType] = useState<string | null>(initialType ?? null);
  const [routeEggGroup, setRouteEggGroup] = useState<string | null>(initialEggGroup ?? null);
  const [detail, setDetail] = useState<PokemonDetailType | null>(null);
  const [species, setSpecies] = useState<SpeciesData | null>(null);
  const [evolution, setEvolution] = useState<EvolutionStage[]>([]);
  const [encounters, setEncounters] = useState<EncounterEntry[]>([]);
  const [alternateForms, setAlternateForms] = useState<FormVariety[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const [tab, setTab] = useState<Tab>('stats');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [section, setSection] = useState<Section>('pokedex');

  // Follow the ?pokemon= link coming from the type / egg-group pages
  useEffect(() => {
    if (initialId && initialId > 0) {
      setSelectedId(initialId);
      setMobileView('detail');
    }
  }, [initialId]);

  // Pick up the stored / browser language after hydration
  useEffect(() => {
    setLang(detectLang());
  }, []);

  // Load list
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setListLoading(true);
      setListError(false);
      try {
        const list = await fetchPokemonList();
        if (!cancelled) {
          setPokemonList(list);
          setListLoading(false);
        }
      } catch {
        if (!cancelled) {
          setListError(true);
          setListLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load detail + species + game data when selection changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setDetailLoading(true);
      setDetail(null);
      setSpecies(null);
      setEvolution([]);
      setEncounters([]);
      setAlternateForms([]);
      try {
        const [d, s] = await Promise.all([
          fetchPokemonDetail(selectedId),
          fetchSpeciesData(selectedId),
        ]);
        if (!cancelled) {
          setDetail(d);
          setSpecies(s);
          setDetailLoading(false);
        }

        const formNames = (s.varieties ?? []).filter(
          (name) => name !== d.name && ['mega', 'regional'].includes(categorize(name))
        );
        const [evo, enc, forms] = await Promise.all([
          s.evolutionChainUrl ? fetchEvolutionChain(s.evolutionChainUrl).catch(() => []) : Promise.resolve([]),
          fetchEncounters(selectedId).catch(() => []),
          Promise.all(formNames.map((name) => fetchFormVariety(name).catch(() => null))),
        ]);
        if (!cancelled) {
          setEvolution(evo);
          setEncounters(enc);
          setAlternateForms(forms.filter((form): form is FormVariety => form !== null));
        }
      } catch {
        if (!cancelled) {
          setDetailLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const handleLangChange = useCallback((l: LanguageCode) => {
    setLang(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const handleSelect = useCallback((id: number) => {
    setSelectedId(id);
    setTab('stats');
    setMobileView('detail');
  }, []);

  // Curated Smogon sets when available, otherwise a Smogon-style set derived
  // from the Pokémon's own stats, typing, abilities and learnset.
  const builds = useMemo(() => {
    if (!detail) return [];
    const currentFormCategory = categorize(detail.name);
    const isCurrentAlternateForm = currentFormCategory !== 'other';
    const curated = smogonBuilds
      .filter(
        (b) =>
          b.pokemonId === detail.id &&
          (isCurrentAlternateForm || !isFormSetDescription(b.description))
      )
      .map((b) => ({
        ...normalizeCuratedBuild(b, detail),
        ...(isCurrentAlternateForm
          ? { formName: detail.name, formCategory: currentFormCategory }
          : {}),
      }));
    const generated = generateBuild(detail, species);
    generated.description = roleNote(lang, generated.role);
    const isFinalStage =
      evolution.length > 0 && !evolution.some((stage) => stage.fromId === detail.id);
    const generatedAlternatives =
      isFinalStage && curated.length === 0
        ? generateAlternativeBuilds(detail, species).map((build) => ({
            ...build,
            description: roleNote(lang, build.role),
          }))
        : [];
    if (isCurrentAlternateForm) {
      generated.formName = detail.name;
      generated.formCategory = currentFormCategory;
    }

    const formBuilds = alternateForms.flatMap((form) => {
      const formDetail: PokemonDetailType = {
        ...detail,
        id: form.id,
        name: form.name,
        types: form.types,
        stats: form.stats,
        abilities: form.abilities,
        abilityDetails: form.abilities.map((name) => ({ name, isHidden: false })),
        spriteUrl: form.spriteUrl,
        artworkUrl: form.artworkUrl,
        moves: form.moves,
        height: form.height,
        weight: form.weight,
      };
      const curatedFormBuilds = smogonBuilds
        .filter((b) => b.pokemonId === form.id || (b.pokemonId === detail.id && curatedBuildMatchesForm(b, form)))
        .map((b) => ({
          ...normalizeCuratedBuild(b, formDetail),
          formName: form.name,
          formCategory: categorize(form.name),
        }));
      const generatedFormBuild = generateBuild(formDetail, species);
      if (megaStones[form.name]) generatedFormBuild.item = megaStones[form.name]!;
      generatedFormBuild.description = roleNote(lang, generatedFormBuild.role);
      generatedFormBuild.formName = form.name;
      generatedFormBuild.formCategory = categorize(form.name);
      // Every mega/regional form always gets this generated Smogon-style
      // fallback, even when no curated set exists for that exact variety.
      return [...curatedFormBuilds, generatedFormBuild];
    });

    return curated.length > 0
      ? [...curated, generated, ...formBuilds]
      : [generated, ...generatedAlternatives, ...formBuilds];
  }, [detail, species, lang, alternateForms, evolution]);

  const displayName = species?.names?.[lang] ?? detail?.name ?? '';

  return (
    <ResourceProvider lang={lang}>
 <div className="min-h-[100dvh] w-full shrink-0 bg-[#e4eef0] text-[#17324d]">
<div className="mx-auto w-full max-w-none px-1 pt-1 pb-3 sm:px-3 sm:pt-2 sm:pb-7">
       <div className="pokedex-shell overflow-hidden rounded-[1.7rem] border border-[#b74642]/50 sm:rounded-[2.2rem]">
          {/* === Top lid === */}
          <div className="relative animate-hinge-open">
            <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
              {/* Left: blue lens */}
              <div className="flex items-center gap-3">
                <div className="lens-pulse flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-pokedex-blue">
                  <div className="h-4 w-4 rounded-full bg-white/90" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-red-300/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400 ring-2 ring-yellow-200/50" />
                </div>
              </div>

              {/* Center: title */}
              <div className="text-center">
                <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-md sm:text-4xl">
                  Metadex
                </h1>
              </div>

              {/* Right: language selector + yellow button + vents */}
              <div className="flex items-center gap-3">
                <LanguageSelector lang={lang} onChange={handleLangChange} />
                <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-pokedex-yellow shadow-inner sm:flex">
                  <div className="h-3 w-3 rounded-full bg-yellow-600/40" />
                </div>
              </div>
            </div>

            {/* Section navigation */}
            <div className="flex items-center justify-center gap-2 px-5 pb-3 sm:px-8">
              {(['pokedex', 'moves', 'items'] as Section[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSection(s)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
                    section === s
                      ? 'bg-white text-pokedex-red shadow-md'
                      : 'bg-white/15 text-white/80 hover:bg-white/25'
                  }`}
                >
                  {u(lang, s === 'pokedex' ? 'nav_pokedex' : s === 'moves' ? 'nav_moves' : 'nav_items')}
                </button>
              ))}
            </div>

           <div className="h-1 bg-[#17324d]/80" />
          </div>

          {/* === Screen area === */}
           <div className="screen-glow bg-[#17324d] p-2.5 sm:p-4">
             <div className="pokedex-screen overflow-hidden rounded-[1.2rem] border-2 border-[#17324d]/70 shadow-inner sm:rounded-2xl">
              {section === 'moves' ? (
                <div className="h-[70vh] overflow-y-auto bg-[#f4f8f7] p-4 sm:h-[75vh] sm:p-6 pokeball-scroll">
                  <MovesSection lang={lang} />
                </div>
              ) : section === 'items' ? (
                <div className="h-[70vh] overflow-y-auto bg-[#f4f8f7] p-4 sm:h-[75vh] sm:p-6 pokeball-scroll">
                  <ItemsSection lang={lang} />
                </div>
              ) : listError ? (
                <div className="flex h-[70vh] flex-col items-center justify-center px-6 text-center">
                  <AlertCircle size={40} className="mb-3 text-red-400" />
                  <p className="mb-4 text-sm text-white/70">{t(lang, 'error_load')}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="rounded-lg bg-pokedex-red px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-95"
                  >
                    {t(lang, 'retry')}
                  </button>
                </div>
              ) : (
                <div className="flex h-[70vh] sm:h-[75vh]">
                  {/* Left panel: list */}
                  <div
                    className={`${
                      mobileView === 'list' ? 'flex' : 'hidden'
                    } w-full shrink-0 flex-col border-r border-[#c8dddf] bg-[#edf6f6] sm:flex sm:w-80 lg:w-96`}
                  >
                    <PokemonList
                      pokemon={pokemonList}
                      selectedId={selectedId}
                      onSelect={handleSelect}
                      lang={lang}
                      loading={listLoading}
                      initialEggGroup={routeEggGroup ?? undefined}
                      initialType={routeType ?? undefined}
                      onEggGroupFilterChange={setRouteEggGroup}
                      onTypeFilterChange={setRouteType}
                    />
                  </div>

                  {/* Right panel: detail + builds */}
                <div
  className={`${
    mobileView === 'detail' ? 'flex' : 'hidden'
  } w-full min-w-0 flex-col sm:flex`}
>
                  
                    {/* Mobile back button */}
                    <button
                      onClick={() => setMobileView('list')}
                      className="flex items-center gap-1 border-b border-gray-100 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 sm:hidden"
                    >
                      <ChevronLeft size={16} />
                      {t(lang, 'back_to_list')}
                    </button>

                    {/* Tabs */}
                    <div className="flex shrink-0 border-b border-[#d6e2e3] bg-[#fbfcf8]">
                      <button
                        onClick={() => setTab('stats')}
                        className={`flex-1 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                          tab === 'stats'
                            ? 'border-b-2 border-pokedex-red text-pokedex-red'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {t(lang, 'tab_stats')}
                      </button>
                      <button
                        onClick={() => setTab('builds')}
                        className={`flex-1 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                          tab === 'builds'
                            ? 'border-b-2 border-pokedex-red text-pokedex-red'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          <BookOpen size={15} />
                          {t(lang, 'tab_builds')}
                          {builds.length > 0 && (
                            <span className="rounded-full bg-pokedex-red px-1.5 py-0.5 text-xs font-bold text-white">
                              {builds.length}
                            </span>
                          )}
                        </span>
                      </button>
                    </div>

                    {/* Tab content */}
                   <div className="flex-1 overflow-hidden">
                      {tab === 'stats' ? (
                        <div className="animate-fade-in-up h-full">
                          <PokemonDetail
                            detail={detail}
                            species={species}
                            lang={lang}
                            loading={detailLoading}
                            selectedPokemonId={selectedId}
                            extra={
                              detail ? (
                                <>
                                  <GameData
                                    detail={detail}
                                    species={species}
                                    evolution={evolution}
                                    encounters={encounters}
                                    lang={lang}
                                    onSelect={handleSelect}
                                  />
                                  <FormsSection
                                    detail={detail}
                                    species={species}
                                    lang={lang}
                                  />
                                </>
                              ) : null
                            }
                          />
                        </div>
                      ) : (
                           <div className="animate-fade-in-up h-full overflow-y-auto bg-[#f4f8f7] p-4 sm:p-6 pokeball-scroll">
                          <SmogonBuilds
                            builds={builds}
                            pokemonName={displayName}
                            lang={lang}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-[#557084]">
          {t(lang, 'footer')}
        </p>
      </div>
    </div>
    </ResourceProvider>
  );
}
