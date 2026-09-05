import type { LanguageCode } from '@/pokedex/types';

export type UiKey =
  | 'nav_pokedex' | 'nav_moves' | 'nav_items'
  | 'moves_title' | 'moves_subtitle' | 'items_title' | 'items_subtitle'
  | 'search_moves' | 'search_items' | 'load_more' | 'showing'
  | 'power' | 'accuracy' | 'pp' | 'priority' | 'damage_class'
  | 'physical' | 'special' | 'status'
  | 'effect' | 'no_effect' | 'category' | 'cost' | 'fling_power'
  | 'generation' | 'gen_short' | 'all_gens' | 'no_moves_gen'
  | 'loading' | 'no_results' | 'move' | 'item' | 'ability'
  | 'location' | 'click_hint' | 'all_types' | 'all_classes' | 'ailment'
  | 'no_data'
  | 'sort_by' | 'sort_machine' | 'sort_type' | 'sort_class' | 'sort_name'
  | 'sort_power' | 'machine' | 'no_machine' | 'machines_only' | 'items_all_categories';

type Dict = Record<UiKey, string>;

const en: Dict = {
  nav_pokedex: 'Pokédex',
  nav_moves: 'Moves',
  nav_items: 'Items',
  moves_title: 'Move index',
  moves_subtitle: 'Every move with power, accuracy and localized effect',
  items_title: 'Item index',
  items_subtitle: 'Every item with its localized effect and cost',
  search_moves: 'Search a move...',
  search_items: 'Search an item...',
  load_more: 'Load more',
  showing: 'Showing',
  power: 'Power',
  accuracy: 'Accuracy',
  pp: 'PP',
  priority: 'Priority',
  damage_class: 'Category',
  physical: 'Physical',
  special: 'Special',
  status: 'Status',
  effect: 'Effect',
  no_effect: 'No description available in this language.',
  category: 'Category',
  cost: 'Price',
  fling_power: 'Fling power',
  generation: 'Generation',
  gen_short: 'Gen',
  all_gens: 'All',
  no_moves_gen: 'No level-up moves in this generation.',
  loading: 'Loading...',
  no_results: 'No results',
  move: 'Move',
  item: 'Item',
  ability: 'Ability',
  location: 'Location',
  click_hint: 'Tap for details',
  all_types: 'All types',
  all_classes: 'All categories',
  ailment: 'Status effect',
  sort_by: 'Sort by',
  sort_machine: 'TM / HM number',
  sort_type: 'Type',
  sort_class: 'Category',
  sort_name: 'Name',
  sort_power: 'Power',
  machine: 'Machine',
  no_machine: 'Not available as a TM/HM',
  machines_only: 'TM / HM only',
  items_all_categories: 'All categories',
  no_data: 'No data',
};

const it: Dict = {
  nav_pokedex: 'Pokédex',
  nav_moves: 'Mosse',
  nav_items: 'Strumenti',
  moves_title: 'Elenco delle mosse',
  moves_subtitle: 'Tutte le mosse con potenza, precisione ed effetti localizzati',
  items_title: 'Elenco degli strumenti',
  items_subtitle: 'Tutti gli strumenti con effetto localizzato e prezzo',
  search_moves: 'Cerca una mossa...',
  search_items: 'Cerca un oggetto...',
  load_more: 'Carica altro',
  showing: 'Visualizzati',
  power: 'Potenza',
  accuracy: 'Precisione',
  pp: 'PP',
  priority: 'Priorità',
  damage_class: 'Categoria',
  physical: 'Fisica',
  special: 'Speciale',
  status: 'Stato',
  effect: 'Effetto',
  no_effect: 'Nessuna descrizione disponibile in questa lingua.',
  category: 'Categoria',
  cost: 'Prezzo',
  fling_power: 'Potenza del lancio',
  generation: 'Generazione',
  gen_short: 'Gen',
  all_gens: 'Tutte',
  no_moves_gen: 'Nessuna mossa appresa salendo di livello in questa generazione.',
  loading: 'Caricamento...',
  no_results: 'Nessun risultato',
  move: 'Mossa',
  item: 'Oggetto',
  ability: 'Abilità',
  location: 'Località',
  click_hint: 'Seleziona per i dettagli',
  all_types: 'Tutti i tipi',
  all_classes: 'Tutte le categorie',
  ailment: 'Alterazione di stato',
  sort_by: 'Ordina per',
  sort_machine: 'Numero MT / MN',
  sort_type: 'Tipo',
  sort_class: 'Categoria',
  sort_name: 'Nome',
  sort_power: 'Potenza',
  machine: 'MT/MN',
  no_machine: 'Non disponibile come MT/MN',
  machines_only: 'Solo MT/MN',
  items_all_categories: 'Tutte le categorie',
  no_data: 'Nessun dato',
};

const es: Dict = {
  ...en,
  nav_moves: 'Movimientos',
  nav_items: 'Objetos',
  moves_title: 'Índice de movimientos',
  moves_subtitle: 'Todos los movimientos con potencia, precisión y efecto traducido',
  items_title: 'Índice de objetos',
  items_subtitle: 'Todos los objetos con su efecto traducido y precio',
  search_moves: 'Buscar un movimiento...',
  search_items: 'Buscar un objeto...',
  load_more: 'Cargar más',
  showing: 'Mostrando',
  power: 'Potencia',
  accuracy: 'Precisión',
  priority: 'Prioridad',
  damage_class: 'Categoría',
  physical: 'Físico',
  special: 'Especial',
  status: 'Estado',
  effect: 'Efecto',
  no_effect: 'No hay descripción disponible en este idioma.',
  category: 'Categoría',
  cost: 'Precio',
  fling_power: 'Potencia de Lanzamiento',
  generation: 'Generación',
  all_gens: 'Todas',
  no_moves_gen: 'No hay movimientos por nivel en esta generación.',
  loading: 'Cargando...',
  no_results: 'Sin resultados',
  move: 'Movimiento',
  item: 'Objeto',
  ability: 'Habilidad',
  location: 'Localización',
  click_hint: 'Toca para ver detalles',
  all_types: 'Todos los tipos',
  all_classes: 'Todas las categorías',
  ailment: 'Estado alterado',
  no_data: 'Sin datos',
};

const fr: Dict = {
  ...en,
  nav_moves: 'Capacités',
  nav_items: 'Objets',
  moves_title: 'Index des capacités',
  moves_subtitle: 'Toutes les capacités avec puissance, précision et effet traduit',
  items_title: 'Index des objets',
  items_subtitle: 'Tous les objets avec leur effet traduit et leur prix',
  search_moves: 'Rechercher une capacité...',
  search_items: 'Rechercher un objet...',
  load_more: 'Charger plus',
  showing: 'Affichés',
  power: 'Puissance',
  accuracy: 'Précision',
  priority: 'Priorité',
  damage_class: 'Catégorie',
  physical: 'Physique',
  special: 'Spéciale',
  status: 'Statut',
  effect: 'Effet',
  no_effect: 'Aucune description disponible dans cette langue.',
  category: 'Catégorie',
  cost: 'Prix',
  fling_power: 'Puissance de Dégommage',
  generation: 'Génération',
  all_gens: 'Toutes',
  no_moves_gen: 'Aucune capacité par niveau dans cette génération.',
  loading: 'Chargement...',
  no_results: 'Aucun résultat',
  move: 'Capacité',
  item: 'Objet',
  ability: 'Talent',
  location: 'Lieu',
  click_hint: 'Toucher pour les détails',
  all_types: 'Tous les types',
  all_classes: 'Toutes les catégories',
  ailment: 'Altération de statut',
  no_data: 'Aucune donnée',
};

const de: Dict = {
  ...en,
  nav_moves: 'Attacken',
  nav_items: 'Items',
  moves_title: 'Attacken-Index',
  moves_subtitle: 'Alle Attacken mit Stärke, Genauigkeit und übersetztem Effekt',
  items_title: 'Item-Index',
  items_subtitle: 'Alle Items mit übersetztem Effekt und Preis',
  search_moves: 'Attacke suchen...',
  search_items: 'Item suchen...',
  load_more: 'Mehr laden',
  showing: 'Angezeigt',
  power: 'Stärke',
  accuracy: 'Genauigkeit',
  priority: 'Priorität',
  damage_class: 'Kategorie',
  physical: 'Physisch',
  special: 'Spezial',
  status: 'Status',
  effect: 'Effekt',
  no_effect: 'Keine Beschreibung in dieser Sprache verfügbar.',
  category: 'Kategorie',
  cost: 'Preis',
  fling_power: 'Schleuder-Stärke',
  generation: 'Generation',
  all_gens: 'Alle',
  no_moves_gen: 'Keine Level-Attacken in dieser Generation.',
  loading: 'Wird geladen...',
  no_results: 'Keine Ergebnisse',
  move: 'Attacke',
  item: 'Item',
  ability: 'Fähigkeit',
  location: 'Ort',
  click_hint: 'Für Details tippen',
  all_types: 'Alle Typen',
  all_classes: 'Alle Kategorien',
  ailment: 'Statusproblem',
  no_data: 'Keine Daten',
};

const ja: Dict = {
  ...en,
  nav_moves: '技',
  nav_items: 'どうぐ',
  moves_title: '技一覧',
  moves_subtitle: 'すべての技の威力・命中率・効果',
  items_title: 'どうぐ一覧',
  items_subtitle: 'すべてのどうぐの効果と値段',
  search_moves: '技を検索...',
  search_items: 'どうぐを検索...',
  load_more: 'もっと見る',
  showing: '表示中',
  power: '威力',
  accuracy: '命中',
  pp: 'PP',
  priority: '優先度',
  damage_class: '分類',
  physical: '物理',
  special: '特殊',
  status: '変化',
  effect: '効果',
  no_effect: 'この言語の説明はありません。',
  category: 'カテゴリ',
  cost: '値段',
  fling_power: 'なげつける威力',
  generation: '世代',
  gen_short: '第',
  all_gens: 'すべて',
  no_moves_gen: 'この世代のレベルアップ技はありません。',
  loading: '読み込み中...',
  no_results: '該当なし',
  move: '技',
  item: 'どうぐ',
  ability: '特性',
  location: '場所',
  click_hint: 'タップで詳細',
  all_types: 'すべてのタイプ',
  all_classes: 'すべての分類',
  ailment: '状態異常',
  no_data: 'データなし',
};

export const uiTranslations: Record<LanguageCode, Dict> = { it, en, es, fr, de, ja };

export function u(lang: LanguageCode, key: UiKey): string {
  return uiTranslations[lang]?.[key] ?? en[key] ?? key;
}

const italianItemCategories: Record<string, string> = {
  'held-items': 'Strumenti tenuti',
  collectables: 'Oggetti da collezione',
  evolution: 'Evoluzione',
  spelunking: 'Esplorazione',
  medicine: 'Medicine',
  vitamins: 'Vitamine',
  healing: 'Cura',
  'status-cures': 'Cura degli stati alterati',
  'pkmn-specific': 'Specifici per Pokémon',
  other: 'Altro',
  'effort-training': 'Allenamento EV',
  badges: 'Medaglie',
  'plot-advancement': 'Avanzamento della storia',
  gameplay: 'Gameplay',
  combat: 'Lotta',
  move: 'Mosse',
  machines: 'MT/MN',
  berries: 'Bacche',
  'dex-completion': 'Completamento del Pokédex',
  'apricorn-box': 'Scatola Ghicocche',
};

const italianAilments: Record<string, string> = {
  none: 'Nessuno',
  paralysis: 'Paralisi',
  sleep: 'Sonno',
  freeze: 'Congelamento',
  burn: 'Scottatura',
  poison: 'Avvelenamento',
  confusion: 'Confusione',
  infatuation: 'Infatuazione',
  trap: 'Intrappolamento',
  nightmare: 'Incubo',
  'leech-seed': 'Parassitaseme',
  curse: 'Maledizione',
  yawn: 'Sbadiglio',
  'perish-song': 'Canto del Destino',
  encore: 'Encore',
  disable: 'Inibitore',
  toxic: 'Avvelenamento grave',
};

function humanizeResourceLabel(value: string): string {
  return value.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function itemCategoryLabel(lang: LanguageCode, category: string): string {
  return lang === 'it'
    ? italianItemCategories[category] ?? humanizeResourceLabel(category)
    : humanizeResourceLabel(category);
}

export function ailmentLabel(lang: LanguageCode, ailment: string): string {
  return lang === 'it'
    ? italianAilments[ailment] ?? humanizeResourceLabel(ailment)
    : humanizeResourceLabel(ailment);
}

/** Localized labels for item categories / ailments that PokeAPI returns as slugs. */
export function damageClassLabel(lang: LanguageCode, cls: string): string {
  if (cls === 'physical') return u(lang, 'physical');
  if (cls === 'special') return u(lang, 'special');
  return u(lang, 'status');
}

/** Localized short label for a machine kind (TM / HM / TR). */
const machineLabels: Record<LanguageCode, Record<string, string>> = {
  en: { tm: 'TM', hm: 'HM', tr: 'TR' },
  it: { tm: 'MT', hm: 'MN', tr: 'DT' },
  es: { tm: 'MT', hm: 'MO', tr: 'DT' },
  fr: { tm: 'CT', hm: 'CS', tr: 'DT' },
  de: { tm: 'TM', hm: 'VM', tr: 'TP' },
  ja: { tm: '技', hm: '秘伝', tr: '技録' },
};

export function machineKindLabel(lang: LanguageCode, kind: string): string {
  return machineLabels[lang]?.[kind] ?? machineLabels.en[kind] ?? kind.toUpperCase();
}

/** e.g. "MT026" in Italian, "TM026" in English. Digit width follows the game (2 or 3). */
export function machineLabel(
  lang: LanguageCode,
  kind: string,
  number: number,
  digits = 2,
): string {
  return `${machineKindLabel(lang, kind)}${String(number).padStart(digits, '0')}`;
}
