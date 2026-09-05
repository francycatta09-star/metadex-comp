import type { LanguageCode } from '@/pokedex/types';

/** PokeAPI egg-group slugs, in Pokédex order. */
export const allEggGroups = [
  'monster',
  'water1',
  'water2',
  'water3',
  'bug',
  'flying',
  'ground',
  'fairy',
  'plant',
  'humanshape',
  'mineral',
  'indeterminate',
  'ditto',
  'dragon',
  'no-eggs',
] as const;

export type EggGroupSlug = (typeof allEggGroups)[number];

/** Fallback labels used before/if the PokeAPI localized name is unavailable. */
export const eggGroupNames: Record<LanguageCode, Record<string, string>> = {
  it: {
    monster: 'Mostro', water1: 'Acqua 1', water2: 'Acqua 2', water3: 'Acqua 3',
    bug: 'Coleottero', flying: 'Volante', ground: 'Campo', fairy: 'Folletto',
    plant: 'Erba', humanshape: 'Umanoide', mineral: 'Minerale',
    indeterminate: 'Amorfo', ditto: 'Ditto', dragon: 'Drago', 'no-eggs': 'Senza uova',
  },
  en: {
    monster: 'Monster', water1: 'Water 1', water2: 'Water 2', water3: 'Water 3',
    bug: 'Bug', flying: 'Flying', ground: 'Field', fairy: 'Fairy',
    plant: 'Grass', humanshape: 'Human-Like', mineral: 'Mineral',
    indeterminate: 'Amorphous', ditto: 'Ditto', dragon: 'Dragon', 'no-eggs': 'No Eggs',
  },
  es: {
    monster: 'Monstruo', water1: 'Agua 1', water2: 'Agua 2', water3: 'Agua 3',
    bug: 'Bicho', flying: 'Volador', ground: 'Campo', fairy: 'Hada',
    plant: 'Planta', humanshape: 'Humanoide', mineral: 'Mineral',
    indeterminate: 'Amorfo', ditto: 'Ditto', dragon: 'Dragón', 'no-eggs': 'Desconocido',
  },
  fr: {
    monster: 'Monstrueux', water1: 'Aquatique 1', water2: 'Aquatique 2', water3: 'Aquatique 3',
    bug: 'Insectoïde', flying: 'Aérien', ground: 'Terrestre', fairy: 'Féerique',
    plant: 'Végétal', humanshape: 'Humanoïde', mineral: 'Minéral',
    indeterminate: 'Amorphe', ditto: 'Ditto', dragon: 'Draconique', 'no-eggs': 'Inconnu',
  },
  de: {
    monster: 'Monster', water1: 'Wasser 1', water2: 'Wasser 2', water3: 'Wasser 3',
    bug: 'Käfer', flying: 'Flug', ground: 'Feld', fairy: 'Fee',
    plant: 'Pflanze', humanshape: 'Humanotyp', mineral: 'Mineral',
    indeterminate: 'Amorph', ditto: 'Ditto', dragon: 'Drache', 'no-eggs': 'Unbekannt',
  },
  ja: {
    monster: 'かいじゅう', water1: 'すいちゅう1', water2: 'すいちゅう2', water3: 'すいちゅう3',
    bug: 'むし', flying: 'ひこう', ground: 'りくじょう', fairy: 'ようせい',
    plant: 'しょくぶつ', humanshape: 'ひとがた', mineral: 'こうぶつ',
    indeterminate: 'ふていけい', ditto: 'メタモン', dragon: 'ドラゴン', 'no-eggs': 'タマゴみはっけん',
  },
};

export function eggGroupName(lang: LanguageCode, slug: string): string {
  return eggGroupNames[lang]?.[slug] ?? eggGroupNames.en[slug] ?? slug;
}

/** Short UI strings for the egg-group features. */
const uiStrings: Record<LanguageCode, Record<string, string>> = {
  it: { egg_group_filter: 'Gruppo di uova', browse_type: 'Pokémon di tipo', browse_egg: 'Gruppo di uova', back: 'Torna al Pokédex', results: 'risultati', loading: 'Caricamento...' },
  en: { egg_group_filter: 'Egg group', browse_type: 'Pokémon of type', browse_egg: 'Egg group', back: 'Back to Pokédex', results: 'results', loading: 'Loading...' },
  es: { egg_group_filter: 'Grupo huevo', browse_type: 'Pokémon de tipo', browse_egg: 'Grupo huevo', back: 'Volver al Pokédex', results: 'resultados', loading: 'Cargando...' },
  fr: { egg_group_filter: 'Groupe œuf', browse_type: 'Pokémon de type', browse_egg: 'Groupe œuf', back: 'Retour au Pokédex', results: 'résultats', loading: 'Chargement...' },
  de: { egg_group_filter: 'Ei-Gruppe', browse_type: 'Pokémon vom Typ', browse_egg: 'Ei-Gruppe', back: 'Zurück zum Pokédex', results: 'Ergebnisse', loading: 'Lädt...' },
  ja: { egg_group_filter: 'タマゴグループ', browse_type: 'タイプ', browse_egg: 'タマゴグループ', back: 'ポケデックスに戻る', results: '件', loading: '読み込み中...' },
};

export function e(lang: LanguageCode, key: string): string {
  return uiStrings[lang]?.[key] ?? uiStrings.en[key] ?? key;
}
