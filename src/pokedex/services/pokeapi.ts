import type {
  PokemonListEntry,
  PokemonDetail,
  SpeciesData,
  EvolutionStage,
  EncounterEntry,
  PokemonStats,
} from '@/pokedex/types';
import { getGeneration, MAX_POKEMON_ID } from '@/pokedex/data/regions';

const API_BASE = 'https://pokeapi.co/api/v2';
const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const ARTWORK_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

const LIST_KEY = 'pokedex_list_v2';
const TYPES_KEY = 'pokedex_types_v2';
const DETAIL_PREFIX = 'pokedex_detail_v3_';
const SPECIES_PREFIX = 'pokedex_species_v2_';
const EVO_PREFIX = 'pokedex_evo_v1_';
const ENCOUNTER_PREFIX = 'pokedex_enc_v1_';

export function getSpriteUrl(id: number): string {
  return `${SPRITE_BASE}/${id}.png`;
}

export function getArtworkUrl(id: number): string {
  return `${ARTWORK_BASE}/${id}.png`;
}

function getCached<T>(key: string): T | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch {
    return null;
  }
}

function setCached<T>(key: string, data: T): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage might be full — skip caching
  }
}

interface RawListResult {
  name: string;
  url: string;
}

function idFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1] ?? '0', 10);
}

export async function fetchPokemonList(): Promise<PokemonListEntry[]> {
  const cached = getCached<PokemonListEntry[]>(LIST_KEY);
  if (cached && cached.length > 0) return cached;

  const response = await fetch(`${API_BASE}/pokemon?limit=2000`);
  if (!response.ok) throw new Error('Failed to fetch Pokémon list');
  const data = await response.json();

  const rawEntries: RawListResult[] = data.results;
  const entries: PokemonListEntry[] = rawEntries
    .map((r) => ({ id: idFromUrl(r.url), name: r.name }))
    .filter((e) => e.id > 0 && e.id <= MAX_POKEMON_ID)
    .map((e) => ({
      id: e.id,
      name: e.name,
      types: [] as string[],
      generation: getGeneration(e.id),
    }));

  const typeMap = await fetchAllTypes();
  for (const entry of entries) {
    entry.types = typeMap[entry.id] ?? [];
  }

  setCached(LIST_KEY, entries);
  return entries;
}

interface RawTypePokemon {
  slot: number;
  pokemon: { name: string; url: string };
}

async function fetchAllTypes(): Promise<Record<number, string[]>> {
  const cached = getCached<Record<number, string[]>>(TYPES_KEY);
  if (cached) return cached;

  const typeMap: Record<number, string[]> = {};
  // Keep the official slot order (primary type first) instead of the order the
  // per-type endpoints happen to be fetched in.
  const slotMap: Record<number, { slot: number; name: string }[]> = {};
  const typeIds = Array.from({ length: 18 }, (_, i) => i + 1);

  const responses = await Promise.all(
    typeIds.map((id) =>
      fetch(`${API_BASE}/type/${id}`).then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch type ${id}`);
        return r.json();
      })
    )
  );

  for (const typeData of responses) {
    const typeName: string = typeData.name;
    const pokemon: RawTypePokemon[] = typeData.pokemon ?? [];
    for (const p of pokemon) {
      const id = idFromUrl(p.pokemon.url);
      if (id > 0 && id <= MAX_POKEMON_ID) {
        if (!slotMap[id]) slotMap[id] = [];
        slotMap[id]!.push({ slot: p.slot ?? 1, name: typeName });
      }
    }
  }

  for (const [id, slots] of Object.entries(slotMap)) {
    typeMap[Number(id)] = slots.sort((a, b) => a.slot - b.slot).map((entry) => entry.name);
  }

  setCached(TYPES_KEY, typeMap);
  return typeMap;
}

interface RawStat {
  base_stat: number;
  effort: number;
  stat: { name: string };
}

interface RawType {
  slot: number;
  type: { name: string };
}

interface RawAbility {
  ability: { name: string };
  is_hidden: boolean;
}

interface RawMove {
  move: { name: string };
  version_group_details: {
    level_learned_at: number;
    move_learn_method: { name: string };
    version_group: { name: string };
  }[];
}

/** PokeAPI version-group slug -> generation number */
export const versionGroupGeneration: Record<string, number> = {
  'red-blue': 1, yellow: 1,
  'gold-silver': 2, crystal: 2,
  'ruby-sapphire': 3, emerald: 3, 'firered-leafgreen': 3, colosseum: 3, xd: 3,
  'diamond-pearl': 4, platinum: 4, 'heartgold-soulsilver': 4,
  'black-white': 5, 'black-2-white-2': 5,
  'x-y': 6, 'omega-ruby-alpha-sapphire': 6,
  'sun-moon': 7, 'ultra-sun-ultra-moon': 7, 'lets-go-pikachu-lets-go-eevee': 7,
  'sword-shield': 8, 'brilliant-diamond-and-shining-pearl': 8, 'legends-arceus': 8,
  'scarlet-violet': 9,
};


const statKeyMap: Record<string, keyof PokemonStats> = {
  hp: 'hp',
  attack: 'attack',
  defense: 'defense',
  'special-attack': 'spAttack',
  'special-defense': 'spDefense',
  speed: 'speed',
};

export async function fetchPokemonDetail(id: number): Promise<PokemonDetail> {
  const cacheKey = `${DETAIL_PREFIX}${id}`;
  const cached = getCached<PokemonDetail>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE}/pokemon/${id}`);
  if (!response.ok) throw new Error('Failed to fetch Pokémon details');
  const data = await response.json();

  const rawStats: RawStat[] = data.stats ?? [];
  const types: RawType[] = data.types ?? [];
  const abilities: RawAbility[] = data.abilities ?? [];
  const rawMoves: RawMove[] = data.moves ?? [];

  const stats: PokemonStats = {
    hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0,
  };
  const effortYield: Partial<PokemonStats> = {};
  for (const s of rawStats) {
    const key = statKeyMap[s.stat.name];
    if (!key) continue;
    stats[key] = s.base_stat;
    if (s.effort > 0) effortYield[key] = s.effort;
  }

  // Level-up learnset grouped by generation (min level per move within a gen)
  const byGen: Record<string, Record<string, number>> = {};
  for (const m of rawMoves) {
    for (const v of m.version_group_details ?? []) {
      if (v.move_learn_method?.name !== 'level-up') continue;
      const gen = versionGroupGeneration[v.version_group?.name ?? ''];
      if (!gen) continue;
      const bucket = (byGen[gen] ??= {});
      const level = v.level_learned_at;
      const current = bucket[m.move.name];
      if (current === undefined || level < current) bucket[m.move.name] = level;
    }
  }

  const levelUpByGen: Record<string, { move: string; level: number }[]> = {};
  for (const [gen, bucket] of Object.entries(byGen)) {
    levelUpByGen[gen] = Object.entries(bucket)
      .map(([move, level]) => ({ move, level }))
      .sort((a, b) => a.level - b.level || a.move.localeCompare(b.move));
  }

  const latestGen = Object.keys(levelUpByGen)
    .map(Number)
    .sort((a, b) => b - a)[0];
  const levelUpMoves = latestGen ? (levelUpByGen[String(latestGen)] ?? []) : [];


  const detail: PokemonDetail = {
    id: data.id,
    name: data.name,
    types: types.slice().sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
    stats,
    height: data.height,
    weight: data.weight,
    abilities: abilities.map((a) => a.ability.name),
    abilityDetails: abilities.map((a) => ({ name: a.ability.name, isHidden: a.is_hidden })),
    spriteUrl: getSpriteUrl(data.id),
    artworkUrl: getArtworkUrl(data.id),
    moves: rawMoves.map((m) => m.move.name),
    levelUpMoves,
    levelUpByGen,
    baseExperience: data.base_experience ?? 0,
    effortYield,
    heldItems: (data.held_items ?? []).map((h: { item: { name: string } }) => h.item.name),
  };

  setCached(cacheKey, detail);
  return detail;
}

interface RawName {
  name: string;
  language: { name: string };
}

interface RawFlavorText {
  flavor_text: string;
  language: { name: string };
}

interface RawGenus {
  genus: string;
  language: { name: string };
}

export async function fetchSpeciesData(id: number): Promise<SpeciesData> {
  const cacheKey = `${SPECIES_PREFIX}${id}`;
  const cached = getCached<SpeciesData>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE}/pokemon-species/${id}`);
  if (!response.ok) throw new Error('Failed to fetch species data');
  const data = await response.json();

  const names: Record<string, string> = {};
  const descriptions: Record<string, string> = {};
  const genera: Record<string, string> = {};

  for (const n of (data.names ?? []) as RawName[]) {
    names[n.language.name] = n.name;
  }
  for (const entry of (data.flavor_text_entries ?? []) as RawFlavorText[]) {
    if (!descriptions[entry.language.name]) {
      descriptions[entry.language.name] = entry.flavor_text.replace(/[\f\n\r]/g, ' ');
    }
  }
  for (const g of (data.genera ?? []) as RawGenus[]) {
    genera[g.language.name] = g.genus;
  }

  const species: SpeciesData = {
    id: data.id,
    names,
    descriptions,
    genera,
    captureRate: data.capture_rate ?? 0,
    baseHappiness: data.base_happiness ?? 0,
    growthRate: data.growth_rate?.name ?? null,
    eggGroups: (data.egg_groups ?? []).map((g: { name: string }) => g.name),
    genderRate: data.gender_rate ?? -1,
    hatchCounter: data.hatch_counter ?? 0,
    habitat: data.habitat?.name ?? null,
    shape: data.shape?.name ?? null,
    color: data.color?.name ?? null,
    isLegendary: Boolean(data.is_legendary),
    isMythical: Boolean(data.is_mythical),
    isBaby: Boolean(data.is_baby),
    evolutionChainUrl: data.evolution_chain?.url ?? null,
    varieties: (data.varieties ?? []).map((v: { pokemon: { name: string } }) => v.pokemon.name),
  };

  setCached(cacheKey, species);
  return species;
}

interface RawEvoDetail {
  trigger: { name: string } | null;
  min_level: number | null;
  item: { name: string } | null;
  held_item: { name: string } | null;
  time_of_day: string;
  location: { name: string } | null;
  known_move: { name: string } | null;
  known_move_type: { name: string } | null;
  min_happiness: number | null;
  min_affection: number | null;
  min_beauty: number | null;
  needs_overworld_rain: boolean;
  gender: number | null;
  trade_species: { name: string } | null;
  turn_upside_down: boolean;
}

interface RawChainLink {
  species: { name: string; url: string };
  evolution_details: RawEvoDetail[];
  evolves_to: RawChainLink[];
}

function flattenChain(
  link: RawChainLink,
  stage: number,
  fromId: number | null,
  out: EvolutionStage[]
): void {
  const detail = link.evolution_details?.[0];
  out.push({
    id: idFromUrl(link.species.url),
    name: link.species.name,
    stage,
    fromId,
    trigger: detail?.trigger?.name ?? null,
    minLevel: detail?.min_level ?? null,
    item: detail?.item?.name ?? null,
    heldItem: detail?.held_item?.name ?? null,
    timeOfDay: detail?.time_of_day ? detail.time_of_day : null,
    location: detail?.location?.name ?? null,
    knownMove: detail?.known_move?.name ?? null,
    knownMoveType: detail?.known_move_type?.name ?? null,
    minHappiness: detail?.min_happiness ?? null,
    minAffection: detail?.min_affection ?? null,
    minBeauty: detail?.min_beauty ?? null,
    needsRain: Boolean(detail?.needs_overworld_rain),
    gender: detail?.gender ?? null,
    tradeSpecies: detail?.trade_species?.name ?? null,
    turnUpsideDown: Boolean(detail?.turn_upside_down),
  });

  const parentId = idFromUrl(link.species.url);
  for (const next of link.evolves_to ?? []) {
    flattenChain(next, stage + 1, parentId, out);
  }
}

export async function fetchEvolutionChain(url: string): Promise<EvolutionStage[]> {
  const chainId = idFromUrl(url);
  const cacheKey = `${EVO_PREFIX}${chainId}`;
  const cached = getCached<EvolutionStage[]>(cacheKey);
  if (cached) return cached;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch evolution chain');
  const data = await response.json();

  const stages: EvolutionStage[] = [];
  if (data.chain) flattenChain(data.chain as RawChainLink, 0, null, stages);

  setCached(cacheKey, stages);
  return stages;
}

interface RawEncounter {
  location_area: { name: string };
  version_details: {
    version: { name: string };
    max_chance: number;
    encounter_details: {
      min_level: number;
      max_level: number;
      method: { name: string };
      chance: number;
    }[];
  }[];
}

export async function fetchEncounters(id: number): Promise<EncounterEntry[]> {
  const cacheKey = `${ENCOUNTER_PREFIX}${id}`;
  const cached = getCached<EncounterEntry[]>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE}/pokemon/${id}/encounters`);
  if (!response.ok) throw new Error('Failed to fetch encounters');
  const data: RawEncounter[] = await response.json();

  const entries: EncounterEntry[] = data.map((e) => {
    const versions = new Set<string>();
    const methods = new Set<string>();
    let minLevel = 100;
    let maxLevel = 0;
    let maxChance = 0;

    for (const v of e.version_details ?? []) {
      versions.add(v.version.name);
      maxChance = Math.max(maxChance, v.max_chance ?? 0);
      for (const d of v.encounter_details ?? []) {
        methods.add(d.method.name);
        minLevel = Math.min(minLevel, d.min_level);
        maxLevel = Math.max(maxLevel, d.max_level);
      }
    }

    return {
      location: e.location_area.name,
      versions: [...versions],
      methods: [...methods],
      minLevel: minLevel === 100 && maxLevel === 0 ? 0 : minLevel,
      maxLevel,
      maxChance,
    };
  });

  setCached(cacheKey, entries);
  return entries;
}

/* ------------------------------------------------------------------ */
/* Alternate forms (Mega Evolutions, regional variants)                */
/* ------------------------------------------------------------------ */

const FORM_PREFIX = 'pokedex_form_v2_';

export interface FormVariety {
  /** PokeAPI variety slug, e.g. "charizard-mega-x" */
  name: string;
  id: number;
  types: string[];
  stats: PokemonStats;
  abilities: string[];
  /** Every move slug the form can learn (any method) */
  moves: string[];
  height: number;
  weight: number;
  spriteUrl: string;
  artworkUrl: string;
  isDefault: boolean;
}

export async function fetchFormVariety(name: string): Promise<FormVariety> {
  const cacheKey = `${FORM_PREFIX}${name}`;
  const cached = getCached<FormVariety>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE}/pokemon/${name}`);
  if (!response.ok) throw new Error(`Failed to fetch form ${name}`);
  const data = await response.json();

  const stats: PokemonStats = {
    hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0,
  };
  for (const s of (data.stats ?? []) as RawStat[]) {
    const key = statKeyMap[s.stat.name];
    if (key) stats[key] = s.base_stat;
  }

  const form: FormVariety = {
    name: data.name,
    id: data.id,
    types: ((data.types ?? []) as RawType[])
      .slice()
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name),
    stats,
    abilities: ((data.abilities ?? []) as RawAbility[]).map((a) => a.ability.name),
    moves: ((data.moves ?? []) as RawMove[]).map((m) => m.move.name),
    height: data.height ?? 0,
    weight: data.weight ?? 0,
    spriteUrl: getSpriteUrl(data.id),
    artworkUrl: getArtworkUrl(data.id),
    isDefault: Boolean(data.is_default),
  };

  setCached(cacheKey, form);
  return form;
}


const EGG_GROUP_PREFIX = 'pokedex_egggroup_v1_';

/**
 * Species IDs that belong to a given egg group (PokeAPI /egg-group/{slug}).
 * Species IDs match Pokémon IDs for default forms, which is what the list uses.
 */
export async function fetchEggGroupSpecies(slug: string): Promise<number[]> {
  const cacheKey = `${EGG_GROUP_PREFIX}${slug}`;
  const cached = getCached<number[]>(cacheKey);
  if (cached && cached.length > 0) return cached;

  const response = await fetch(`${API_BASE}/egg-group/${slug}`);
  if (!response.ok) throw new Error(`Failed to fetch egg group ${slug}`);
  const data = await response.json();
  const ids: number[] = ((data.pokemon_species ?? []) as RawListResult[])
    .map((s) => idFromUrl(s.url))
    .filter((id) => id > 0 && id <= MAX_POKEMON_ID);

  setCached(cacheKey, ids);
  return ids;
}
