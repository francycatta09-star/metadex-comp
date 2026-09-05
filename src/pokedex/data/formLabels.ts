import type { LanguageCode } from '@/pokedex/types';

/**
 * Labels for the Mega Evolution / regional form section and for the
 * evolution flow chart.
 */
export type FormKey =
  | 'forms_title' | 'mega_section' | 'regional_section' | 'other_section'
  | 'base_form' | 'forms_none' | 'forms_loading' | 'total'
  | 'requires' | 'no_stone' | 'dragon_ascent'
  | 'alola' | 'galar' | 'hisui' | 'paldea'
  | 'weak_to' | 'resists' | 'immune_to' | 'unique_moves' | 'peculiarities'
  | 'mega_evolves' | 'changed';

type Dict = Record<FormKey, string>;

const en: Dict = {
  forms_title: 'Forms',
  mega_section: 'Mega Evolutions & Primal Reversions',
  regional_section: 'Regional forms',
  other_section: 'Other forms',
  base_form: 'Base form',
  forms_none: 'This Pokémon has no alternate forms.',
  forms_loading: 'Loading forms...',
  total: 'Total',
  requires: 'Requires',
  no_stone: 'No stone needed',
  dragon_ascent: 'Knowing Dragon Ascent',
  alola: 'Alola',
  galar: 'Galar',
  hisui: 'Hisui',
  paldea: 'Paldea',
  weak_to: 'Weak to',
  resists: 'Resists',
  immune_to: 'Immune to',
  unique_moves: 'Exclusive moves',
  peculiarities: 'Peculiarities',
  mega_evolves: 'Mega Evolution',
  changed: 'new',
};

const it: Dict = {
  forms_title: 'Forme',
  mega_section: 'Megaevoluzioni e Archeorisvegli',
  regional_section: 'Forme regionali',
  other_section: 'Altre forme',
  base_form: 'Forma base',
  forms_none: 'Questo Pokémon non ha forme alternative.',
  forms_loading: 'Caricamento delle forme...',
  total: 'Totale',
  requires: 'Richiede',
  no_stone: 'Nessuna pietra necessaria',
  dragon_ascent: 'Deve conoscere Ascesa del Drago',
  alola: 'Alola',
  galar: 'Galar',
  hisui: 'Hisui',
  paldea: 'Paldea',
  weak_to: 'Debole a',
  resists: 'Resiste a',
  immune_to: 'Immunità a',
  unique_moves: 'Mosse esclusive',
  peculiarities: 'Peculiarità',
  mega_evolves: 'Megaevoluzione',
  changed: 'modificata',
};

const es: Dict = {
  forms_title: 'Formas',
  mega_section: 'Megaevoluciones y Regresiones Primigenias',
  regional_section: 'Formas regionales',
  other_section: 'Otras formas',
  base_form: 'Forma base',
  forms_none: 'Este Pokémon no tiene formas alternativas.',
  forms_loading: 'Cargando formas...',
  total: 'Total',
  requires: 'Requiere',
  no_stone: 'No necesita piedra',
  dragon_ascent: 'Conocer Ascenso Draco',
  alola: 'Alola',
  galar: 'Galar',
  hisui: 'Hisui',
  paldea: 'Paldea',
  weak_to: 'Débil a',
  resists: 'Resiste a',
  immune_to: 'Inmune a',
  unique_moves: 'Movimientos exclusivos',
  peculiarities: 'Peculiaridades',
  mega_evolves: 'Megaevolución',
  changed: 'nuevo',
};

const fr: Dict = {
  forms_title: 'Formes',
  mega_section: 'Méga-Évolutions et Primo-Résurgences',
  regional_section: 'Formes régionales',
  other_section: 'Autres formes',
  base_form: 'Forme de base',
  forms_none: "Ce Pokémon n'a pas de formes alternatives.",
  forms_loading: 'Chargement des formes...',
  total: 'Total',
  requires: 'Nécessite',
  no_stone: 'Aucune gemme requise',
  dragon_ascent: 'Connaître Draco Ascension',
  alola: 'Alola',
  galar: 'Galar',
  hisui: 'Hisui',
  paldea: 'Paldea',
  weak_to: 'Faible à',
  resists: 'Résiste à',
  immune_to: 'Immunisé à',
  unique_moves: 'Capacités exclusives',
  peculiarities: 'Particularités',
  mega_evolves: 'Méga-Évolution',
  changed: 'nouveau',
};

const de: Dict = {
  forms_title: 'Formen',
  mega_section: 'Mega-Entwicklungen & Protomorphosen',
  regional_section: 'Regionalformen',
  other_section: 'Weitere Formen',
  base_form: 'Grundform',
  forms_none: 'Dieses Pokémon hat keine alternativen Formen.',
  forms_loading: 'Formen werden geladen...',
  total: 'Gesamt',
  requires: 'Benötigt',
  no_stone: 'Kein Stein nötig',
  dragon_ascent: 'Kenntnis von Zenitstürmer',
  alola: 'Alola',
  galar: 'Galar',
  hisui: 'Hisui',
  paldea: 'Paldea',
  weak_to: 'Schwach gegen',
  resists: 'Resistent gegen',
  immune_to: 'Immun gegen',
  unique_moves: 'Exklusive Attacken',
  peculiarities: 'Besonderheiten',
  mega_evolves: 'Mega-Entwicklung',
  changed: 'neu',
};

const ja: Dict = {
  forms_title: 'フォルム',
  mega_section: 'メガシンカ・ゲンシカイキ',
  regional_section: 'リージョンフォーム',
  other_section: 'そのほかのフォルム',
  base_form: '通常のすがた',
  forms_none: 'このポケモンに別のフォルムはありません。',
  forms_loading: '読み込み中...',
  total: '合計',
  requires: '必要',
  no_stone: 'ストーン不要',
  dragon_ascent: 'ガリョウテンセイを覚える',
  alola: 'アローラ',
  galar: 'ガラル',
  hisui: 'ヒスイ',
  paldea: 'パルデア',
  weak_to: '弱点',
  resists: '半減',
  immune_to: '無効',
  unique_moves: '専用のわざ',
  peculiarities: '特徴',
  mega_evolves: 'メガシンカ',
  changed: '新',
};

const dicts: Record<LanguageCode, Dict> = { en, it, es, fr, de, ja };

export function f(lang: LanguageCode, key: FormKey): string {
  return dicts[lang]?.[key] ?? en[key];
}

export type FormCategory = 'mega' | 'regional' | 'other';

const REGIONS = ['alola', 'galar', 'hisui', 'paldea'] as const;
export type RegionKey = (typeof REGIONS)[number];

export function regionOf(name: string): RegionKey | null {
  for (const r of REGIONS) {
    if (new RegExp(`-${r}(-|$)`).test(name)) return r;
  }
  return null;
}

export function categorize(name: string): FormCategory {
  if (/-mega(-[xy])?$|-primal$/.test(name)) return 'mega';
  if (regionOf(name)) return 'regional';
  return 'other';
}

/** "charizard-mega-x" -> "Mega X" ; "growlithe-hisui" -> "Hisui" */
const italianFormSuffixes: Record<string, string> = {
  paldea: 'di Paldea',
  'paldea-combat-breed': 'di Paldea (Forma Lotta)',
  'paldea-blaze-breed': 'di Paldea (Forma Fiamma)',
  'paldea-aqua-breed': 'di Paldea (Forma Acquatica)',
  'blue-plumage': 'Piumaggio blu',
  'yellow-plumage': 'Piumaggio giallo',
  'white-plumage': 'Piumaggio bianco',
  curly: 'Forma Ricciuta',
  droopy: 'Forma Cascante',
  stretchy: 'Forma Tesa',
  'three-segment': 'Forma a tre segmenti',
  'two-segment': 'Forma a due segmenti',
  'three-family': 'Famiglia di tre',
  'four-family': 'Famiglia di quattro',
  hero: 'Forma Eroe',
  zero: 'Forma Zero',
  roaming: 'Forma vagante',
  'wellspring-mask': 'Maschera Pozzo',
  'hearthflame-mask': 'Maschera Focolare',
  'cornerstone-mask': 'Maschera Fondamenta',
  'teal-mask': 'Maschera Turchese',
  stellar: 'Forma Astrale',
  'limited-build': 'Assetto Base',
  'sprinting-build': 'Assetto Sprint',
  'swimming-build': 'Assetto Nuoto',
  'gliding-build': 'Assetto Volo',
  'combat-breed': 'Forma Lotta',
  'blaze-breed': 'Forma Fiamma',
  'aqua-breed': 'Forma Acquatica',
};

const genericItalianFormWords: Record<string, string> = {
  mega: 'Mega',
  primal: 'Archeorisveglio',
  alola: 'di Alola',
  galar: 'di Galar',
  hisui: 'di Hisui',
  male: 'Maschio',
  female: 'Femmina',
  school: 'Banco',
  solo: 'Forma Individuale',
  midnight: 'Mezzanotte',
  midday: 'Mezzogiorno',
  dusk: 'Crepuscolo',
  dawn: 'Alba',
  wings: 'Ali',
  crown: 'Corona',
  black: 'Nero',
  white: 'Bianco',
  blue: 'Blu',
  yellow: 'Giallo',
  red: 'Rosso',
  form: 'Forma',
};

export function formSuffix(speciesSlug: string, name: string, lang: LanguageCode = 'en'): string {
  const raw = name.startsWith(`${speciesSlug}-`) ? name.slice(speciesSlug.length + 1) : name;
  if (lang === 'it') {
    const exact = italianFormSuffixes[raw];
    if (exact) return exact;
  }
  return raw
    .split('-')
    .map((w) => {
      const translated = lang === 'it' ? genericItalianFormWords[w] : undefined;
      return translated ?? w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');
}
