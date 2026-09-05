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
