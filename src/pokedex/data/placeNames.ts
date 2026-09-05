import type { LanguageCode } from '@/pokedex/types';

/**
 * PokeAPI only ships English (and partial French/German) names for locations and
 * location areas, so encounter places would stay in English for Italian, Spanish
 * and Japanese users. This module translates the recurring geographic terms
 * ("Route", "Cave", "Forest", ...) plus a few well-known full place names, and
 * leaves invented proper nouns untouched, which is what official guides do too.
 */

/** Full-name overrides, matched case-insensitively on the whole English name. */
const fullNames: Partial<Record<LanguageCode, Record<string, string>>> = {
  it: {
    'victory road': 'Via Vittoria',
    'pokemon league': 'Lega Pokémon',
    'pokémon league': 'Lega Pokémon',
    'safari zone': 'Zona Safari',
    'power plant': 'Centrale Elettrica',
    'pokemon mansion': 'Villa Pokémon',
    'pokémon mansion': 'Villa Pokémon',
    'pokemon tower': 'Torre Pokémon',
    'pokémon tower': 'Torre Pokémon',
    'seafoam islands': 'Isole Spumarine',
    'sea route': 'Rotta marina',
    'battle tower': 'Torre Lotta',
    'distortion world': 'Mondo Distorto',
    'hall of origin': 'Sala Originaria',
    'trophy garden': 'Giardino Trofeo',
    'great marsh': 'Grande Palude',
    'national park': 'Parco Nazionale',
    'ruins of alph': 'Rovine di Alph',
    'union cave': 'Grotta Unione',
    'ice path': 'Sentiero Ghiacciato',
    'dark cave': 'Grotta Oscura',
    'burned tower': 'Torre Bruciata',
    'bell tower': 'Torre Campana',
    'whirl islands': 'Isole Vertigo',
    'mt. moon': 'Monte Luna',
    'mt. silver': 'Monte Argento',
    'rock tunnel': 'Galleria Roccia',
    'diglett cave': 'Cunicolo Diglett',
    'cerulean cave': 'Grotta Celeste',
    'digletts cave': 'Cunicolo Diglett',
    "diglett's cave": 'Cunicolo Diglett',
  },
  es: {
    'victory road': 'Calle Victoria',
    'pokemon league': 'Liga Pokémon',
    'pokémon league': 'Liga Pokémon',
    'safari zone': 'Zona Safari',
    'power plant': 'Central Energía',
    'pokemon tower': 'Torre Pokémon',
    'pokémon tower': 'Torre Pokémon',
    'battle tower': 'Torre Batalla',
    'national park': 'Parque Nacional',
    'mt. moon': 'Monte Moon',
    'rock tunnel': 'Túnel Roca',
  },
};

/** Word / phrase level substitutions, applied when no full-name match exists. */
const terms: Partial<Record<LanguageCode, Array<[RegExp, string]>>> = {
  it: [
    [/\bRoutes?\b/g, 'Percorso'],
    // "Road 2 (south...)" is how PokeAPI names early routes.
    [/\bRoad (?=\d)/g, 'Percorso '],
    [/\bPath\b/g, 'Sentiero'],
    [/\bCaverns?\b/g, 'Caverna'],
    [/\bCaves?\b/g, 'Grotta'],
    [/\bForest\b/g, 'Foresta'],
    [/\bWoods\b/g, 'Bosco'],
    [/\bJungle\b/g, 'Giungla'],
    [/\bMt\.?\b/g, 'Monte'],
    [/\bMount\b/g, 'Monte'],
    [/\bMountains\b/g, 'Montagne'],
    [/\bMountain\b/g, 'Montagna'],
    [/\bHills?\b/g, 'Collina'],
    [/\bValley\b/g, 'Valle'],
    [/\bDesert\b/g, 'Deserto'],
    [/\bMeadow\b/g, 'Prato'],
    [/\bGarden\b/g, 'Giardino'],
    [/\bPark\b/g, 'Parco'],
    [/\bLake\b/g, 'Lago'],
    [/\bRiver\b/g, 'Fiume'],
    [/\bFalls\b/g, 'Cascate'],
    [/\bSea\b/g, 'Mare'],
    [/\bOcean\b/g, 'Oceano'],
    [/\bBays?\b/g, 'Baia'],
    [/\bBeach\b/g, 'Spiaggia'],
    [/\bShore\b/g, 'Costa'],
    [/\bIslands\b/g, 'Isole'],
    [/\bIsland\b/g, 'Isola'],
    [/\bIslets?\b/g, 'Isolotto'],
    [/\bBridge\b/g, 'Ponte'],
    [/\bTunnels?\b/g, 'Galleria'],
    [/\bTowers?\b/g, 'Torre'],
    [/\bRuins\b/g, 'Rovine'],
    [/\bTemple\b/g, 'Tempio'],
    [/\bShrine\b/g, 'Santuario'],
    [/\bChamber\b/g, 'Camera'],
    [/\bMines?\b/g, 'Miniera'],
    [/\bSwamp\b/g, 'Palude'],
    [/\bMarsh\b/g, 'Palude'],
    [/\bPlains?\b/g, 'Pianura'],
    [/\bFields?\b/g, 'Campi'],
    [/\bVolcano\b/g, 'Vulcano'],
    [/\bCrater\b/g, 'Cratere'],
    [/\bRanch\b/g, 'Fattoria'],
    [/\bFarm\b/g, 'Fattoria'],
    [/\bVillage\b/g, 'Villaggio'],
    [/\bZone\b/g, 'Zona'],
    [/\bArea\b/g, 'Area'],
    [/\bGrass\b/g, 'Erba'],
    [/\bCanyon\b/g, 'Canyon'],
    [/\bWasteland\b/g, 'Terre Desolate'],
    [/\bIcy\b/g, 'Ghiacciato'],
    [/\bSnow\b/g, 'Neve'],
    [/\bnorth\b/g, 'nord'],
    [/\bsouth\b/g, 'sud'],
    [/\beast\b/g, 'est'],
    [/\bwest\b/g, 'ovest'],
    [/\btowards\b/g, 'verso'],
  ],
  es: [
    [/\bRoutes?\b/g, 'Ruta'],
    [/\bRoad (?=\d)/g, 'Ruta '],
    [/\bPath\b/g, 'Senda'],
    [/\bCaverns?\b/g, 'Caverna'],
    [/\bCaves?\b/g, 'Cueva'],
    [/\bForest\b/g, 'Bosque'],
    [/\bWoods\b/g, 'Bosque'],
    [/\bMt\.?\b/g, 'Monte'],
    [/\bMount\b/g, 'Monte'],
    [/\bMountains?\b/g, 'Montaña'],
    [/\bValley\b/g, 'Valle'],
    [/\bDesert\b/g, 'Desierto'],
    [/\bMeadow\b/g, 'Prado'],
    [/\bGarden\b/g, 'Jardín'],
    [/\bPark\b/g, 'Parque'],
    [/\bLake\b/g, 'Lago'],
    [/\bRiver\b/g, 'Río'],
    [/\bFalls\b/g, 'Cataratas'],
    [/\bSea\b/g, 'Mar'],
    [/\bBeach\b/g, 'Playa'],
    [/\bIslands?\b/g, 'Isla'],
    [/\bBridge\b/g, 'Puente'],
    [/\bTunnels?\b/g, 'Túnel'],
    [/\bTowers?\b/g, 'Torre'],
    [/\bRuins\b/g, 'Ruinas'],
    [/\bMines?\b/g, 'Mina'],
    [/\bSwamp\b/g, 'Pantano'],
    [/\bMarsh\b/g, 'Pantano'],
    [/\bVolcano\b/g, 'Volcán'],
    [/\bVillage\b/g, 'Pueblo'],
    [/\bZone\b/g, 'Zona'],
    [/\bGrass\b/g, 'Hierba'],
    [/\bnorth\b/g, 'norte'],
    [/\bsouth\b/g, 'sur'],
    [/\beast\b/g, 'este'],
    [/\bwest\b/g, 'oeste'],
    [/\btowards\b/g, 'hacia'],
  ],
  fr: [
    [/\bRoutes?\b/g, 'Route'],
    [/\bCaves?\b/g, 'Grotte'],
    [/\bForest\b/g, 'Forêt'],
    [/\bMt\.?\b/g, 'Mont'],
    [/\bMount\b/g, 'Mont'],
    [/\bLake\b/g, 'Lac'],
    [/\bIslands?\b/g, 'Île'],
    [/\bTowers?\b/g, 'Tour'],
    [/\bTunnels?\b/g, 'Tunnel'],
  ],
  de: [
    [/\bRoutes?\b/g, 'Route'],
    [/\bCaves?\b/g, 'Höhle'],
    [/\bForest\b/g, 'Wald'],
    [/\bMt\.?\b/g, 'Berg'],
    [/\bMount\b/g, 'Berg'],
    [/\bLake\b/g, 'See'],
    [/\bIslands?\b/g, 'Insel'],
    [/\bTowers?\b/g, 'Turm'],
    [/\bTunnels?\b/g, 'Tunnel'],
  ],
};

/**
 * Translates the generic part of an English place name into `lang`.
 * Returns the input unchanged for English (or when nothing matches).
 */
export function placeName(lang: LanguageCode, englishName: string): string {
  if (!englishName || lang === 'en' || lang === 'ja') return englishName;

  const exact = fullNames[lang]?.[englishName.trim().toLowerCase()];
  if (exact) return exact;

  const rules = terms[lang];
  if (!rules) return englishName;

  let out = englishName;
  for (const [pattern, replacement] of rules) {
    out = out.replace(pattern, replacement);
  }
  return out;
}
