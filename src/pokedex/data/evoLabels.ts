import type { LanguageCode } from '@/pokedex/types';

/**
 * Extra labels for the evolution flow chart, the mega evolution section and the
 * egg group filter. Kept in its own module so the big UI dictionary stays stable.
 */
export type EvoKey =
  | 'happiness' | 'affection' | 'beauty' | 'rain' | 'upside_down' | 'female' | 'male'
  | 'mega_forms' | 'mega_stone' | 'primal_orb' | 'egg_group_filter' | 'requirement'
  | 'time_day' | 'time_night' | 'time_dusk' | 'trade_with' | 'egg_group_loading';

type Dict = Record<EvoKey, string>;

const en: Dict = {
  happiness: 'Friendship',
  affection: 'Affection',
  beauty: 'Beauty',
  rain: 'While raining',
  upside_down: 'Console upside down',
  female: 'Female only',
  male: 'Male only',
  mega_forms: 'Mega Evolutions & special forms',
  mega_stone: 'Mega Stone',
  primal_orb: 'Orb',
  egg_group_filter: 'Egg group',
  requirement: 'Requirement',
  time_day: 'Daytime',
  time_night: 'Night',
  time_dusk: 'Dusk',
  trade_with: 'Trade with',
  egg_group_loading: 'Loading egg group...',
};

const it: Dict = {
  happiness: 'Felicità',
  affection: 'Affetto',
  beauty: 'Bellezza',
  rain: 'Mentre piove',
  upside_down: 'Console capovolta',
  female: 'Solo femmina',
  male: 'Solo maschio',
  mega_forms: 'Megaevoluzioni e forme speciali',
  mega_stone: 'Megapietra',
  primal_orb: 'Sfera',
  egg_group_filter: 'Gruppo di uova',
  requirement: 'Requisito',
  time_day: 'Di giorno',
  time_night: 'Di notte',
  time_dusk: 'Al crepuscolo',
  trade_with: 'Scambio con',
  egg_group_loading: 'Caricamento del gruppo di uova...',
};

const es: Dict = {
  happiness: 'Amistad',
  affection: 'Afecto',
  beauty: 'Belleza',
  rain: 'Mientras llueve',
  upside_down: 'Consola boca abajo',
  female: 'Solo hembra',
  male: 'Solo macho',
  mega_forms: 'Megaevoluciones y formas especiales',
  mega_stone: 'Megapiedra',
  primal_orb: 'Orbe',
  egg_group_filter: 'Grupo huevo',
  requirement: 'Requisito',
  time_day: 'De día',
  time_night: 'De noche',
  time_dusk: 'Al anochecer',
  trade_with: 'Intercambio con',
  egg_group_loading: 'Cargando grupo huevo...',
};

const fr: Dict = {
  happiness: 'Bonheur',
  affection: 'Affection',
  beauty: 'Beauté',
  rain: "Sous la pluie",
  upside_down: 'Console retournée',
  female: 'Femelle uniquement',
  male: 'Mâle uniquement',
  mega_forms: 'Méga-Évolutions et formes spéciales',
  mega_stone: 'Méga-Gemme',
  primal_orb: 'Orbe',
  egg_group_filter: "Groupe d'Œuf",
  requirement: 'Condition',
  time_day: 'Le jour',
  time_night: 'La nuit',
  time_dusk: 'Au crépuscule',
  trade_with: 'Échange avec',
  egg_group_loading: "Chargement du groupe d'Œuf...",
};

const de: Dict = {
  happiness: 'Freundschaft',
  affection: 'Zuneigung',
  beauty: 'Schönheit',
  rain: 'Bei Regen',
  upside_down: 'Konsole umgedreht',
  female: 'Nur Weibchen',
  male: 'Nur Männchen',
  mega_forms: 'Mega-Entwicklungen & Sonderformen',
  mega_stone: 'Mega-Stein',
  primal_orb: 'Juwel',
  egg_group_filter: 'Ei-Gruppe',
  requirement: 'Bedingung',
  time_day: 'Am Tag',
  time_night: 'Nachts',
  time_dusk: 'In der Dämmerung',
  trade_with: 'Tausch mit',
  egg_group_loading: 'Ei-Gruppe wird geladen...',
};

const ja: Dict = {
  happiness: 'なつき度',
  affection: 'なかよし度',
  beauty: 'うつくしさ',
  rain: '雨のとき',
  upside_down: '本体を逆さに',
  female: 'メスのみ',
  male: 'オスのみ',
  mega_forms: 'メガシンカ・特別なフォルム',
  mega_stone: 'メガストーン',
  primal_orb: 'オーブ',
  egg_group_filter: 'タマゴグループ',
  requirement: '条件',
  time_day: '昼',
  time_night: '夜',
  time_dusk: '夕方',
  trade_with: '通信交換',
  egg_group_loading: '読み込み中...',
};

const dicts: Record<LanguageCode, Dict> = { en, it, es, fr, de, ja };

export function e(lang: LanguageCode, key: EvoKey): string {
  return dicts[lang]?.[key] ?? en[key];
}

/** PokeAPI egg group slugs, in Pokédex-guide order. */
export const eggGroupSlugs = [
  'monster', 'water1', 'water2', 'water3', 'bug', 'flying', 'ground', 'fairy',
  'plant', 'humanshape', 'mineral', 'indeterminate', 'dragon', 'ditto', 'no-eggs',
] as const;
