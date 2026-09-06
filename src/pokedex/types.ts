export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
}

export interface PokemonListEntry {
  id: number;
  name: string;
  types: string[];
  generation: number;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonDetail {
  id: number;
  name: string;
  types: string[];
  stats: PokemonStats;
  height: number;
  weight: number;
  abilities: string[];
  abilityDetails: PokemonAbility[];
  spriteUrl: string;
  artworkUrl: string;
  /** PokeAPI move slugs the Pokémon can learn */
  moves: string[];
  /** Level-up learnset of the latest available version group */
  levelUpMoves: { move: string; level: number }[];
  /** Level-up learnset per generation number ("1".."9") */
  levelUpByGen: Record<string, { move: string; level: number }[]>;

  baseExperience: number;
  /** EV yield per stat, e.g. { spAttack: 3 } */
  effortYield: Partial<PokemonStats>;
  heldItems: string[];
}

export interface EvolutionStage {
  id: number;
  name: string;
  /** Depth in the chain: 0 = base form */
  stage: number;
  fromId: number | null;
  trigger: string | null;
  minLevel: number | null;
  item: string | null;
  heldItem: string | null;
  timeOfDay: string | null;
  location: string | null;
  knownMove: string | null;
  knownMoveType: string | null;
  minHappiness: number | null;
  minAffection: number | null;
  minBeauty: number | null;
  needsRain: boolean;
  gender: number | null;
  tradeSpecies: string | null;
  turnUpsideDown: boolean;
}

export interface EncounterEntry {
  location: string;
  versions: string[];
  methods: string[];
  minLevel: number;
  maxLevel: number;
  maxChance: number;
}

export interface SpeciesData {
  id: number;
  names: Record<string, string>;
  descriptions: Record<string, string>;
  genera: Record<string, string>;
  captureRate: number;
  baseHappiness: number;
  growthRate: string | null;
  eggGroups: string[];
  genderRate: number;
  hatchCounter: number;
  habitat: string | null;
  shape: string | null;
  color: string | null;
  isLegendary: boolean;
  isMythical: boolean;
  isBaby: boolean;
  evolutionChainUrl: string | null;
  varieties: string[];
}

export interface SmogonBuild {
  pokemonId: number;
  /** Alternate PokeAPI variety slug when this set belongs to a Mega or regional form. */
  formName?: string;
  formCategory?: 'mega' | 'regional' | 'other';
  format: string;
  ability: string;
  item: string;
  nature: string;
  moves: string[];
  evs: Partial<PokemonStats>;
  ivs?: Partial<PokemonStats>;
  description: string;
  /** Role label key, e.g. 'physical_sweeper' */
  role?: string;
  /** true when derived from the Pokémon's data instead of a curated Smogon set */
  generated?: boolean;
}

export interface TypeInfo {
  name: string;
  color: string;
  textColor: string;
  icon: string;
}

export type LanguageCode = 'it' | 'en' | 'es' | 'fr' | 'de' | 'ja';
// src/pokedex/types.ts (o dove definisci il tipo Move)
export type SpecialMoveType = 'z-move' | 'z-exclusive' | 'max-move' | 'g-max' | 'signature';

export interface Move {
  id: string;
  name: string;
  type: string;
  category: 'Physical' | 'Special' | 'Status';
  specialType?: SpecialMoveType;
  // ... altri campi esistenti
}

// Configurazione delle etichette in italiano con stili Tailwind
export const ITALIAN_SPECIAL_MOVE_CONFIG: Record<SpecialMoveType, { label: string; className: string }> = {
  'z-move': { label: 'Mossa Z', className: 'bg-purple-600 text-white hover:bg-purple-700' },
  'z-exclusive': { label: 'Mossa Z Esclusiva', className: 'bg-indigo-600 text-white hover:bg-indigo-700' },
  'max-move': { label: 'Mossa Max', className: 'bg-red-600 text-white hover:bg-red-700' },
  'g-max': { label: 'Mossa Gigamax', className: 'bg-orange-600 text-white hover:bg-orange-700' },
  'signature': { label: 'Mossa Peculiare', className: 'bg-amber-500 text-white hover:bg-amber-600' },
};
