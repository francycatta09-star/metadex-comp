import type { LanguageCode } from '@/pokedex/types';
import { statLabels } from '@/pokedex/data/translations';

export type GameKey =
  | 'game_data' | 'defense_chart' | 'weak_4x' | 'weak_2x' | 'resist_2x' | 'resist_4x' | 'immune'
  | 'evolution' | 'evolution_none' | 'base_form' | 'locations' | 'locations_none'
  | 'locations_hint' | 'breeding' | 'training' | 'capture_rate' | 'base_happiness'
  | 'growth_rate' | 'egg_groups' | 'egg_cycles' | 'gender' | 'genderless' | 'habitat'
  | 'base_exp' | 'ev_yield' | 'held_items' | 'none' | 'level' | 'levels' | 'method'
  | 'versions' | 'chance' | 'learnset' | 'show_all' | 'show_less' | 'ivs' | 'notes'
  | 'tier' | 'source_smogon' | 'source_derived' | 'role' | 'physical_dmg' | 'special_dmg'
  | 'catch_easy' | 'catch_hard' | 'more_locations' | 'ability_hidden' | 'unknown';

type Dict = Record<GameKey, string>;

const en: Dict = {
  game_data: 'Game data',
  defense_chart: 'Type matchups',
  weak_4x: 'Weak ×4',
  weak_2x: 'Weak ×2',
  resist_2x: 'Resists ×½',
  resist_4x: 'Resists ×¼',
  immune: 'Immune',
  evolution: 'Evolution line',
  evolution_none: 'This Pokémon does not evolve.',
  base_form: 'Base form',
  locations: 'Where to find it',
  locations_none: 'No wild encounters recorded — obtained by evolution, trade, gift or event.',
  locations_hint: 'Wild encounters across the main games',
  breeding: 'Breeding',
  training: 'Training',
  capture_rate: 'Catch rate',
  base_happiness: 'Base friendship',
  growth_rate: 'Growth rate',
  egg_groups: 'Egg groups',
  egg_cycles: 'Egg cycles',
  gender: 'Gender ratio',
  genderless: 'Genderless',
  habitat: 'Habitat',
  base_exp: 'Base EXP',
  ev_yield: 'EV yield',
  held_items: 'Held items',
  none: 'None',
  level: 'Lv.',
  levels: 'Levels',
  method: 'Method',
  versions: 'Games',
  chance: 'Chance',
  learnset: 'Level-up moves',
  show_all: 'Show all',
  show_less: 'Show less',
  ivs: 'IVs',
  notes: 'Usage notes',
  tier: 'Tier',
  source_smogon: 'Competitive set',
  source_derived: 'Competitive-style set',
  role: 'Role',
  physical_dmg: 'Physical',
  special_dmg: 'Special',
  catch_easy: 'easy',
  catch_hard: 'hard',
  more_locations: 'more locations',
  ability_hidden: 'hidden',
  unknown: 'Unknown',
};

const it: Dict = {
  game_data: 'Dati di gioco',
  defense_chart: 'Efficacia dei tipi',
  weak_4x: 'Debole ×4',
  weak_2x: 'Debole ×2',
  resist_2x: 'Resistenza ×½',
  resist_4x: 'Resistenza ×¼',
  immune: 'Immunità',
  evolution: 'Linea evolutiva',
  evolution_none: 'Questo Pokémon non evolve.',
  base_form: 'Forma base',
  locations: 'Dove trovarlo',
  locations_none: 'Nessun incontro selvatico registrato — si ottiene per evoluzione, scambio, dono o evento.',
  locations_hint: 'Incontri allo stato selvatico nei giochi principali',
  breeding: 'Riproduzione',
  training: 'Allenamento',
  capture_rate: 'Tasso di cattura',
  base_happiness: 'Felicità di base',
  growth_rate: 'Tasso di crescita',
  egg_groups: 'Gruppi di uova',
  egg_cycles: 'Cicli di schiusa',
  gender: 'Rapporto tra i sessi',
  genderless: 'Senza sesso',
  habitat: 'Habitat',
  base_exp: 'Esperienza base',
  ev_yield: 'EV ottenuti',
  held_items: 'Strumenti tenuti',
  none: 'Nessuno',
  level: 'Lv.',
  levels: 'Livelli',
  method: 'Metodo',
  versions: 'Giochi',
  chance: 'Probabilità',
  learnset: 'Mosse apprese salendo di livello',
  show_all: 'Mostra tutte',
  show_less: 'Mostra meno',
  ivs: 'IV',
  notes: "Note d'uso",
  tier: 'Tier',
  source_smogon: 'Set competitivo',
  source_derived: 'Set in stile competitivo',
  role: 'Ruolo',
  physical_dmg: 'Fisico',
  special_dmg: 'Speciale',
  catch_easy: 'facile',
  catch_hard: 'difficile',
  more_locations: 'altre località',
  ability_hidden: 'nascosta',
  unknown: 'Sconosciuto',
};

const es: Dict = {
  ...en,
  game_data: 'Datos de juego',
  defense_chart: 'Eficacia de tipos',
  weak_4x: 'Débil ×4',
  weak_2x: 'Débil ×2',
  resist_2x: 'Resiste ×½',
  resist_4x: 'Resiste ×¼',
  immune: 'Inmune',
  evolution: 'Línea evolutiva',
  evolution_none: 'Este Pokémon no evoluciona.',
  base_form: 'Forma base',
  locations: 'Dónde encontrarlo',
  locations_none: 'Sin encuentros salvajes — se obtiene por evolución, intercambio, regalo o evento.',
  locations_hint: 'Encuentros salvajes en los juegos principales',
  breeding: 'Cría',
  training: 'Entrenamiento',
  capture_rate: 'Ratio de captura',
  base_happiness: 'Amistad inicial',
  growth_rate: 'Curva de crecimiento',
  egg_groups: 'Grupos huevo',
  egg_cycles: 'Ciclos de huevo',
  gender: 'Proporción de género',
  genderless: 'Sin género',
  habitat: 'Hábitat',
  base_exp: 'EXP base',
  ev_yield: 'EV otorgados',
  held_items: 'Objetos equipados',
  none: 'Ninguno',
  levels: 'Niveles',
  method: 'Método',
  versions: 'Juegos',
  chance: 'Probabilidad',
  learnset: 'Movimientos por nivel',
  show_all: 'Ver todos',
  show_less: 'Ver menos',
  notes: 'Notas de uso',
  role: 'Rol',
  physical_dmg: 'Físico',
  special_dmg: 'Especial',
  catch_easy: 'fácil',
  catch_hard: 'difícil',
  more_locations: 'más localizaciones',
  ability_hidden: 'oculta',
  unknown: 'Desconocido',
};

const fr: Dict = {
  ...en,
  game_data: 'Données de jeu',
  defense_chart: 'Efficacité des types',
  weak_4x: 'Faible ×4',
  weak_2x: 'Faible ×2',
  resist_2x: 'Résiste ×½',
  resist_4x: 'Résiste ×¼',
  immune: 'Immunisé',
  evolution: 'Ligne évolutive',
  evolution_none: "Ce Pokémon n'évolue pas.",
  base_form: 'Forme de base',
  locations: 'Où le trouver',
  locations_none: 'Aucune rencontre sauvage — obtenu par évolution, échange, cadeau ou événement.',
  locations_hint: 'Rencontres sauvages dans les jeux principaux',
  breeding: 'Reproduction',
  training: 'Entraînement',
  capture_rate: 'Taux de capture',
  base_happiness: 'Bonheur de base',
  growth_rate: 'Courbe de croissance',
  egg_groups: 'Groupes d’Œuf',
  egg_cycles: 'Cycles d’Œuf',
  gender: 'Répartition des sexes',
  genderless: 'Asexué',
  habitat: 'Habitat',
  base_exp: 'EXP de base',
  ev_yield: 'EV octroyés',
  held_items: 'Objets tenus',
  none: 'Aucun',
  levels: 'Niveaux',
  method: 'Méthode',
  versions: 'Jeux',
  chance: 'Probabilité',
  learnset: 'Capacités par niveau',
  show_all: 'Tout afficher',
  show_less: 'Afficher moins',
  notes: "Notes d'utilisation",
  role: 'Rôle',
  physical_dmg: 'Physique',
  special_dmg: 'Spéciale',
  catch_easy: 'facile',
  catch_hard: 'difficile',
  more_locations: 'autres lieux',
  ability_hidden: 'cachée',
  unknown: 'Inconnu',
};

const de: Dict = {
  ...en,
  game_data: 'Spieldaten',
  defense_chart: 'Typ-Effektivität',
  weak_4x: 'Schwach ×4',
  weak_2x: 'Schwach ×2',
  resist_2x: 'Resistent ×½',
  resist_4x: 'Resistent ×¼',
  immune: 'Immun',
  evolution: 'Entwicklungsreihe',
  evolution_none: 'Dieses Pokémon entwickelt sich nicht.',
  base_form: 'Grundform',
  locations: 'Fundorte',
  locations_none: 'Keine Wildbegegnungen — durch Entwicklung, Tausch, Geschenk oder Event erhältlich.',
  locations_hint: 'Wildbegegnungen in den Hauptspielen',
  breeding: 'Zucht',
  training: 'Training',
  capture_rate: 'Fangrate',
  base_happiness: 'Basis-Freundschaft',
  growth_rate: 'Wachstumsrate',
  egg_groups: 'Ei-Gruppen',
  egg_cycles: 'Ei-Zyklen',
  gender: 'Geschlechterverhältnis',
  genderless: 'Geschlechtslos',
  habitat: 'Lebensraum',
  base_exp: 'Basis-EXP',
  ev_yield: 'EV-Ausbeute',
  held_items: 'Getragene Items',
  none: 'Keine',
  levels: 'Level',
  method: 'Methode',
  versions: 'Spiele',
  chance: 'Chance',
  learnset: 'Attacken nach Level',
  show_all: 'Alle zeigen',
  show_less: 'Weniger zeigen',
  notes: 'Einsatzhinweise',
  role: 'Rolle',
  physical_dmg: 'Physisch',
  special_dmg: 'Spezial',
  catch_easy: 'leicht',
  catch_hard: 'schwer',
  more_locations: 'weitere Orte',
  ability_hidden: 'versteckt',
  unknown: 'Unbekannt',
};

const ja: Dict = {
  ...en,
  game_data: 'ゲームデータ',
  defense_chart: 'タイプ相性',
  weak_4x: '4倍弱点',
  weak_2x: '2倍弱点',
  resist_2x: '半減',
  resist_4x: '4分の1',
  immune: '無効',
  evolution: '進化の流れ',
  evolution_none: 'このポケモンは進化しません。',
  base_form: '基本形',
  locations: '出現場所',
  locations_none: '野生では出現しません — 進化・交換・イベントで入手。',
  locations_hint: '主要作品での野生出現',
  breeding: 'タマゴ・繁殖',
  training: '育成データ',
  capture_rate: '捕獲率',
  base_happiness: '初期なつき度',
  growth_rate: '経験値タイプ',
  egg_groups: 'タマゴグループ',
  egg_cycles: 'タマゴサイクル',
  gender: '性別比',
  genderless: '性別不明',
  habitat: '生息地',
  base_exp: '基礎経験値',
  ev_yield: '獲得努力値',
  held_items: '持ち物',
  none: 'なし',
  levels: 'レベル',
  method: '方法',
  versions: 'ソフト',
  chance: '出現率',
  learnset: 'レベルアップ技',
  show_all: 'すべて表示',
  show_less: '閉じる',
  notes: '運用メモ',
  role: '役割',
  physical_dmg: '物理',
  special_dmg: '特殊',
  catch_easy: '易しい',
  catch_hard: '難しい',
  more_locations: '他の場所',
  ability_hidden: '隠れ特性',
  unknown: '不明',
};

const dicts: Record<LanguageCode, Dict> = { it, en, es, fr, de, ja };

export function g(lang: LanguageCode, key: GameKey): string {
  return dicts[lang]?.[key] ?? en[key] ?? key;
}

// --- Competitive role labels
const roleLabels: Record<LanguageCode, Record<string, string>> = {
  it: {
    physical_sweeper: 'Attaccante fisico',
    special_sweeper: 'Attaccante speciale',
    physical_wallbreaker: 'Demolitore fisico',
    special_wallbreaker: 'Demolitore speciale',
    setup_sweeper: 'Attaccante da potenziamento',
    physical_wall: 'Muro fisico',
    special_wall: 'Muro speciale',
    utility_pivot: 'Pivot di supporto',
  },
  en: {
    physical_sweeper: 'Physical sweeper',
    special_sweeper: 'Special sweeper',
    physical_wallbreaker: 'Physical wallbreaker',
    special_wallbreaker: 'Special wallbreaker',
    setup_sweeper: 'Setup sweeper',
    physical_wall: 'Physical wall',
    special_wall: 'Special wall',
    utility_pivot: 'Utility pivot',
  },
  es: {
    physical_sweeper: 'Sweeper físico',
    special_sweeper: 'Sweeper especial',
    physical_wallbreaker: 'Rompemuros físico',
    special_wallbreaker: 'Rompemuros especial',
    setup_sweeper: 'Sweeper con setup',
    physical_wall: 'Muro físico',
    special_wall: 'Muro especial',
    utility_pivot: 'Pivote de utilidad',
  },
  fr: {
    physical_sweeper: 'Sweeper physique',
    special_sweeper: 'Sweeper spécial',
    physical_wallbreaker: 'Briseur de murs physique',
    special_wallbreaker: 'Briseur de murs spécial',
    setup_sweeper: 'Sweeper à boost',
    physical_wall: 'Mur physique',
    special_wall: 'Mur spécial',
    utility_pivot: 'Pivot utilitaire',
  },
  de: {
    physical_sweeper: 'Physischer Sweeper',
    special_sweeper: 'Spezial-Sweeper',
    physical_wallbreaker: 'Physischer Wallbreaker',
    special_wallbreaker: 'Spezial-Wallbreaker',
    setup_sweeper: 'Setup-Sweeper',
    physical_wall: 'Physische Wand',
    special_wall: 'Spezial-Wand',
    utility_pivot: 'Utility-Pivot',
  },
  ja: {
    physical_sweeper: '物理エース',
    special_sweeper: '特殊エース',
    physical_wallbreaker: '物理崩し',
    special_wallbreaker: '特殊崩し',
    setup_sweeper: '積みエース',
    physical_wall: '物理受け',
    special_wall: '特殊受け',
    utility_pivot: '補助枠',
  },
};

export function roleLabel(lang: LanguageCode, role?: string): string {
  if (!role) return '';
  return roleLabels[lang]?.[role] ?? roleLabels.en[role] ?? role;
}

// --- Usage notes per role
const roleNotes: Record<LanguageCode, Record<string, string>> = {
  it: {
    physical_sweeper: 'Velocità e Attacco al massimo: mandalo in campo dopo un KO o un cambio favorevole e chiudi la partita. Attenzione alle mosse prioritarie e al blocco imposto dagli strumenti Scelta.',
    special_sweeper: 'Sfrutta Attacco Speciale e Velocità per sfondare le squadre offensive. Gli IV in Attacco a 0 riducono i danni di Ripicca e della confusione.',
    physical_wallbreaker: 'Apre brecce nelle difese avversarie: usa la mossa STAB più potente sul cambio previsto, con il supporto di pivot veloci.',
    special_wallbreaker: 'Potenza speciale elevata ma Velocità media: usa un pivot o Distortozona per portarlo in campo in sicurezza.',
    setup_sweeper: 'Trova un turno libero, potenziati e poi sfonda. Prima del potenziamento è importante rimuovere le trappole e gestire le risposte avversarie.',
    physical_wall: 'Assorbe gli attacchi fisici, si cura e logora gli avversari con le alterazioni di stato. Ottimo con Desiderio, Avanzi e supporto contro i tipi Fuoco ed Elettro.',
    special_wall: 'Resiste agli attacchi speciali e cura la squadra con alterazioni di stato e mosse di recupero. Tienilo lontano dai demolitori con mosse superefficaci.',
    utility_pivot: 'Ruolo di supporto: trappole, alterazioni di stato e controllo del ritmo. Massimizza i PS e la difesa migliore per restare in campo.',
  },
  en: {
    physical_sweeper: 'Max Speed and Attack: bring it in after a KO or a pivot and close the game. Watch out for priority and Choice lock.',
    special_sweeper: 'Uses Special Attack and Speed to punch through offensive teams. 0 Attack IVs cut Foul Play and confusion damage.',
    physical_wallbreaker: 'Opens holes in defensive cores — click your strongest STAB on predicted switches, supported by fast pivots.',
    special_wallbreaker: 'Huge special power but average Speed: bring it in safely with pivots or Trick Room.',
    setup_sweeper: 'Find a free turn, set up the boost, then break through. Remove hazards and checks before setting up.',
    physical_wall: 'Absorbs physical hits, heals and wears foes down with status. Great with Wish/Leftovers and support versus Fire and Electric.',
    special_wall: 'Takes special hits and keeps the team healthy with status and recovery. Keep it away from super-effective wallbreakers.',
    utility_pivot: 'Support role: hazards, status and momentum swings. Max HP plus its better defence to stay on the field.',
  },
  es: {
    physical_sweeper: 'Velocidad y Ataque al máximo: entra tras un KO y cierra la partida. Cuidado con la prioridad y el bloqueo de Choice.',
    special_sweeper: 'Aprovecha Ataque Especial y Velocidad para romper equipos ofensivos. Con 0 IV en Ataque reduces Juego Sucio y confusión.',
    physical_wallbreaker: 'Abre huecos en los muros: golpea en los cambios previsibles con apoyo de pivotes rápidos.',
    special_wallbreaker: 'Mucha potencia especial pero velocidad media: entra con pivotes o Espacio Raro.',
    setup_sweeper: 'Busca un turno libre, sube estadísticas y arrasa. Antes limpia trampas y counters.',
    physical_wall: 'Absorbe golpes físicos, se cura y desgasta con estados. Muy bueno con Deseo/Restos.',
    special_wall: 'Aguanta golpes especiales y cura al equipo. Evita los rompemuros supereficaces.',
    utility_pivot: 'Rol de apoyo: trampas, estados y cambio de ritmo. Maximiza PS y su mejor defensa.',
  },
  fr: {
    physical_sweeper: 'Vitesse et Attaque au max : entre après un KO et termine la partie. Attention à la priorité et au blocage Choice.',
    special_sweeper: 'Utilise Attaque Spéciale et Vitesse pour percer les équipes offensives. 0 IV en Attaque réduit Tricherie et confusion.',
    physical_wallbreaker: 'Ouvre des brèches dans les murs : frappe sur les switchs prévisibles avec des pivots rapides.',
    special_wallbreaker: 'Puissance spéciale énorme mais vitesse moyenne : entre via un pivot ou Distorsion.',
    setup_sweeper: 'Trouve un tour libre, boost puis perce. Nettoie les pièges et les checks avant.',
    physical_wall: 'Encaisse le physique, se soigne et use avec les statuts. Excellent avec Vœu/Restes.',
    special_wall: 'Encaisse le spécial et soigne l’équipe. Éloigne-le des briseurs super efficaces.',
    utility_pivot: 'Rôle de soutien : pièges, statuts et momentum. Max PV et sa meilleure défense.',
  },
  de: {
    physical_sweeper: 'Maximale Initiative und Angriff: nach einem KO einwechseln und das Spiel beenden. Achte auf Erstschlag und Choice-Bindung.',
    special_sweeper: 'Nutzt Spezial-Angriff und Initiative gegen offensive Teams. 0 Angriffs-DVs senken Bitterkuss- und Verwirrungsschaden.',
    physical_wallbreaker: 'Reißt Löcher in defensive Kerne — starke STAB-Attacke auf erwartete Wechsel, unterstützt von schnellen Pivots.',
    special_wallbreaker: 'Enorme Spezialkraft, mittlere Initiative: sicher über Pivots oder Bizarroraum einwechseln.',
    setup_sweeper: 'Freien Zug suchen, boosten, durchbrechen. Vorher Hazards und Checks entfernen.',
    physical_wall: 'Fängt physische Angriffe ab, heilt und zermürbt mit Status. Stark mit Wunsch/Überreste.',
    special_wall: 'Hält Spezialangriffe und hält das Team gesund. Halte es von effektiven Wallbreakern fern.',
    utility_pivot: 'Support-Rolle: Hazards, Status, Momentum. Max KP plus die bessere Verteidigung.',
  },
  ja: {
    physical_sweeper: '素早さと攻撃に全振り。倒したあとや交代読みで出して試合を決める。先制技と技固定に注意。',
    special_sweeper: '特攻と素早さで攻撃的な構築を抜く。攻撃個体値0でイカサマ・混乱のダメージを軽減。',
    physical_wallbreaker: '受けを崩す役。交代読みで最大打点を押し込み、高速の起点作りと合わせる。',
    special_wallbreaker: '火力は高いが素早さは並。サイクルやトリックルームで安全に出す。',
    setup_sweeper: '安全な1ターンで積んでから全抜きを狙う。事前に設置technique と対策を処理。',
    physical_wall: '物理を受けて回復と状態異常で削る。願いごと・たべのこしと相性が良い。',
    special_wall: '特殊を受けて味方を立て直す。抜群を持つ崩し役には出さない。',
    utility_pivot: '補助役。設置・状態異常・流れの奪取。HPと高い方の防御に振って長く居座る。',
  },
};

export function roleNote(lang: LanguageCode, role?: string): string {
  if (!role) return '';
  return roleNotes[lang]?.[role] ?? roleNotes.en[role] ?? '';
}

// --- Evolution trigger labels
const triggerLabels: Record<LanguageCode, Record<string, string>> = {
  it: {
    'level-up': 'Salendo di livello', trade: 'Scambio', 'use-item': 'Usando uno strumento', shed: 'Spazio libero nella squadra + Poké Ball',
    spin: 'Ruotando', 'tower-of-darkness': 'Torre delle Tenebre', 'tower-of-waters': 'Torre delle Acque',
    'three-critical-hits': 'Tre brutti colpi critici', 'take-damage': 'Subendo danni', other: 'Metodo speciale',
    'agile-style-move': 'Mossa in stile agile', 'strong-style-move': 'Mossa in stile forte',
    'recoil-damage': 'Danno da contraccolpo',
  },
  en: {
    'level-up': 'Level up', trade: 'Trade', 'use-item': 'Use item', shed: 'Empty slot + Poké Ball',
    spin: 'Spinning', 'tower-of-darkness': 'Tower of Darkness', 'tower-of-waters': 'Tower of Waters',
    'three-critical-hits': '3 critical hits', 'take-damage': 'Take damage', other: 'Special method',
    'agile-style-move': 'Agile style move', 'strong-style-move': 'Strong style move',
    'recoil-damage': 'Recoil damage',
  },
  es: { 'level-up': 'Subir de nivel', trade: 'Intercambio', 'use-item': 'Usar objeto', other: 'Método especial' },
  fr: { 'level-up': 'Montée de niveau', trade: 'Échange', 'use-item': 'Utiliser un objet', other: 'Méthode spéciale' },
  de: { 'level-up': 'Level-Aufstieg', trade: 'Tausch', 'use-item': 'Item benutzen', other: 'Spezielle Methode' },
  ja: { 'level-up': 'レベルアップ', trade: '通信交換', 'use-item': 'どうぐを使う', other: '特殊な方法' },
};

export function triggerLabel(lang: LanguageCode, trigger: string): string {
  return triggerLabels[lang]?.[trigger] ?? triggerLabels.en[trigger] ?? humanize(trigger);
}

// --- Encounter method labels
const methodLabels: Record<LanguageCode, Record<string, string>> = {
  it: {
    walk: 'Erba alta / a piedi', surf: 'Surf', 'old-rod': 'Amo vecchio', 'good-rod': 'Amo buono',
    'super-rod': 'Super Amo', 'rock-smash': 'Spaccaroccia', headbutt: 'Bottintesta',
    'dark-grass': 'Erba scura', 'grass-spots': 'Ciuffi d\'erba', 'cave-spots': 'Ombre nelle grotte',
    'bridge-spots': 'Ombre sul ponte', 'super-rod-spots': 'Ombre pesca', 'surf-spots': 'Ombre in acqua',
    gift: 'Dono', 'gift-egg': 'Uovo in dono', 'only-one': 'Incontro unico',
    'squirt-bottle': 'Spruzzino', 'seaweed': 'Alghe',
    'walking-in-the-overworld': 'Visibile sulla mappa', 'yellow-flowers': 'Fiori gialli',
    'purple-flowers': 'Fiori viola', 'red-flowers': 'Fiori rossi', 'rough-terrain': 'Terreno accidentato',
    'sport-ball': 'Poké Ball Sport', 'roaming-grass': 'Pokémon errante', 'devon-scope': 'Scanner Devon',
  },
  en: {
    walk: 'Tall grass / walking', surf: 'Surf', 'old-rod': 'Old Rod', 'good-rod': 'Good Rod',
    'super-rod': 'Super Rod', 'rock-smash': 'Rock Smash', headbutt: 'Headbutt',
    'dark-grass': 'Dark grass', gift: 'Gift', 'gift-egg': 'Gift egg', 'only-one': 'One-time encounter',
    'walking-in-the-overworld': 'Visible in the overworld', 'rough-terrain': 'Rough terrain',
  },
  es: {
    walk: 'Hierba alta', surf: 'Surf', gift: 'Regalo', 'old-rod': 'Caña vieja',
    'good-rod': 'Caña buena', 'super-rod': 'Supercaña', 'rock-smash': 'Golpe Roca',
    headbutt: 'Cabezazo', 'only-one': 'Encuentro único',
    'walking-in-the-overworld': 'Visible en el mapa',
  },
  fr: {
    walk: 'Hautes herbes', surf: 'Surf', gift: 'Cadeau', 'old-rod': 'Canne',
    'good-rod': 'Super Canne', 'super-rod': 'Méga Canne', 'rock-smash': 'Éclate-Roc',
    headbutt: 'Coup d\'Boule', 'only-one': 'Rencontre unique',
    'walking-in-the-overworld': 'Visible sur la carte',
  },
  de: {
    walk: 'Hohes Gras', surf: 'Surfer', gift: 'Geschenk', 'old-rod': 'Angel',
    'good-rod': 'Profi-Angel', 'super-rod': 'Superangel', 'rock-smash': 'Zertrümmerer',
    headbutt: 'Kopfnuss', 'only-one': 'Einmaliges Treffen',
    'walking-in-the-overworld': 'Sichtbar in der Spielwelt',
  },
  ja: {
    walk: '草むら', surf: 'なみのり', gift: 'もらう', 'old-rod': 'ボロのつりざお',
    'good-rod': 'いいつりざお', 'super-rod': 'すごいつりざお', 'rock-smash': 'いわくだき',
    headbutt: 'ずつき', 'only-one': '一度だけの出現',
    'walking-in-the-overworld': 'フィールド上に出現',
  },
};

export function methodLabel(lang: LanguageCode, method: string): string {
  return methodLabels[lang]?.[method] ?? methodLabels.en[method] ?? humanize(method);
}

const growthLabels: Record<LanguageCode, Record<string, string>> = {
  it: { slow: 'Lenta', medium: 'Medio-rapida', fast: 'Veloce', 'medium-slow': 'Medio-lenta', 'slow-then-very-fast': 'Imprevedibile', 'fast-then-very-slow': 'Fluttuante' },
  en: { slow: 'Slow', medium: 'Medium fast', fast: 'Fast', 'medium-slow': 'Medium slow', 'slow-then-very-fast': 'Erratic', 'fast-then-very-slow': 'Fluctuating' },
  es: { slow: 'Lenta', medium: 'Media', fast: 'Rápida', 'medium-slow': 'Medio-lenta' },
  fr: { slow: 'Lente', medium: 'Moyenne', fast: 'Rapide', 'medium-slow': 'Moyenne-lente' },
  de: { slow: 'Langsam', medium: 'Mittel', fast: 'Schnell', 'medium-slow': 'Mittel-langsam' },
  ja: { slow: '遅い', medium: '普通', fast: '早い', 'medium-slow': 'やや遅い' },
};

export function growthLabel(lang: LanguageCode, rate: string): string {
  return growthLabels[lang]?.[rate] ?? growthLabels.en[rate] ?? humanize(rate);
}

export function humanize(value: string): string {
  return value
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

type NatureStat = 'attack' | 'defense' | 'spAttack' | 'spDefense' | 'speed';

interface NatureEffect {
  increased: NatureStat | null;
  decreased: NatureStat | null;
}

export interface NatureInfo {
  name: string;
  increased: string | null;
  decreased: string | null;
  neutral: string;
}

const natureEffects: Record<string, NatureEffect> = {
  hardy: { increased: null, decreased: null },
  lonely: { increased: 'attack', decreased: 'defense' },
  adamant: { increased: 'attack', decreased: 'spAttack' },
  naughty: { increased: 'attack', decreased: 'spDefense' },
  brave: { increased: 'attack', decreased: 'speed' },
  bold: { increased: 'defense', decreased: 'attack' },
  docile: { increased: null, decreased: null },
  impish: { increased: 'defense', decreased: 'spAttack' },
  lax: { increased: 'defense', decreased: 'spDefense' },
  relaxed: { increased: 'defense', decreased: 'speed' },
  modest: { increased: 'spAttack', decreased: 'attack' },
  mild: { increased: 'spAttack', decreased: 'defense' },
  bashful: { increased: null, decreased: null },
  rash: { increased: 'spAttack', decreased: 'spDefense' },
  quiet: { increased: 'spAttack', decreased: 'speed' },
  calm: { increased: 'spDefense', decreased: 'attack' },
  gentle: { increased: 'spDefense', decreased: 'defense' },
  careful: { increased: 'spDefense', decreased: 'spAttack' },
  quirky: { increased: null, decreased: null },
  sassy: { increased: 'spDefense', decreased: 'speed' },
  timid: { increased: 'speed', decreased: 'attack' },
  hasty: { increased: 'speed', decreased: 'defense' },
  jolly: { increased: 'speed', decreased: 'spAttack' },
  naive: { increased: 'speed', decreased: 'spDefense' },
  serious: { increased: null, decreased: null },
};

const italianNatureNames: Record<string, string> = {
  hardy: 'Ardita',
  lonely: 'Schiva',
  adamant: 'Decisa',
  naughty: 'Birbona',
  brave: 'Audace',
  bold: 'Sicura',
  docile: 'Docile',
  impish: 'Scaltra',
  lax: 'Fiacca',
  relaxed: 'Placida',
  modest: 'Modesta',
  mild: 'Mite',
  bashful: 'Ritrosa',
  rash: 'Ardente',
  quiet: 'Quieta',
  calm: 'Calma',
  gentle: 'Gentile',
  careful: 'Cauta',
  quirky: 'Furba',
  sassy: 'Vivace',
  timid: 'Timida',
  hasty: 'Lesta',
  jolly: 'Allegra',
  naive: 'Ingenua',
  serious: 'Seria',
};

const natureEffectWords: Record<
  LanguageCode,
  { increases: string; decreases: string; neutral: string }
> = {
  it: { increases: 'Potenzia', decreases: 'Diminuisce', neutral: 'Nessun effetto' },
  en: { increases: 'Increases', decreases: 'Decreases', neutral: 'No effect' },
  es: { increases: 'Aumenta', decreases: 'Disminuye', neutral: 'Sin efecto' },
  fr: { increases: 'Augmente', decreases: 'Diminue', neutral: 'Sans effet' },
  de: { increases: 'Erhöht', decreases: 'Senkt', neutral: 'Kein Effekt' },
  ja: { increases: '上昇', decreases: '下降', neutral: '効果なし' },
};

export function natureInfo(lang: LanguageCode, value: string): NatureInfo {
  const rawName = value.trim().split(/\s|\(/)[0] ?? value;
  const key = rawName.toLowerCase();
  const effect = natureEffects[key];
  const words = natureEffectWords[lang] ?? natureEffectWords.en;
  const name = lang === 'it' ? italianNatureNames[key] ?? rawName : rawName;

  return {
    name,
    increased: effect?.increased ? statLabels[lang]?.[effect.increased] ?? effect.increased : null,
    decreased: effect?.decreased ? statLabels[lang]?.[effect.decreased] ?? effect.decreased : null,
    neutral: words.neutral,
  };
}

export function natureEffectWordsFor(lang: LanguageCode) {
  return natureEffectWords[lang] ?? natureEffectWords.en;
}
