import type { PokemonDetail, SmogonBuild, SpeciesData, PokemonStats } from '@/pokedex/types';
import { movePool, type MoveMeta } from '@/pokedex/data/movePool';
import { attackMultiplier, bestStabType } from '@/pokedex/data/typeChart';
import { allTypes } from '@/pokedex/data/typeInfo';

export type BuildRole =
  | 'physical_sweeper'
  | 'special_sweeper'
  | 'physical_wallbreaker'
  | 'special_wallbreaker'
  | 'setup_sweeper'
  | 'physical_wall'
  | 'special_wall'
  | 'utility_pivot';

export type BuildStyle = 'auto' | 'setup' | 'choice' | 'utility';

const SPEED_FAST = 95;

function bst(stats: PokemonStats): number {
  return stats.hp + stats.attack + stats.defense + stats.spAttack + stats.spDefense + stats.speed;
}

/** Rough Smogon-style tier estimate from base stats and species flags. */
export function estimateTier(detail: PokemonDetail, species: SpeciesData | null): string {
  const total = bst(detail.stats);
  if (species?.isMythical || (species?.isLegendary && total >= 660)) return 'Ubers';
  if (species?.isLegendary) return 'OU';
  if (total >= 580) return 'OU';
  if (total >= 520) return 'UU';
  if (total >= 470) return 'RU';
  if (total >= 410) return 'NU';
  if (total >= 340) return 'PU';
  return 'ZU';
}

function pickRole(detail: PokemonDetail): BuildRole {
  const s = detail.stats;
  const physical = s.attack >= s.spAttack;
  const offense = Math.max(s.attack, s.spAttack);
  const bulk = s.hp + s.defense + s.spDefense;

  if (bulk >= 300 && offense < 100) {
    if (s.defense >= s.spDefense + 15) return 'physical_wall';
    if (s.spDefense >= s.defense + 15) return 'special_wall';
    return 'utility_pivot';
  }
  if (s.speed >= SPEED_FAST && offense >= 95) {
    return physical ? 'physical_sweeper' : 'special_sweeper';
  }
  if (offense >= 110) return physical ? 'physical_wallbreaker' : 'special_wallbreaker';
  if (offense >= 80) return 'setup_sweeper';
  return 'utility_pivot';
}

function isPhysicalRole(role: BuildRole, detail: PokemonDetail): boolean {
  if (role.startsWith('physical')) return true;
  if (role.startsWith('special')) return false;
  return detail.stats.attack >= detail.stats.spAttack;
}

function roleForStyle(detail: PokemonDetail, style: BuildStyle): BuildRole {
  if (style === 'setup') return 'setup_sweeper';
  if (style === 'choice') {
    return detail.stats.attack >= detail.stats.spAttack ? 'physical_sweeper' : 'special_sweeper';
  }
  if (style === 'utility') {
    if (detail.stats.hp + detail.stats.defense + detail.stats.spDefense < 300) {
      return 'utility_pivot';
    }
    return detail.stats.defense >= detail.stats.spDefense ? 'physical_wall' : 'special_wall';
  }
  return pickRole(detail);
}

/** Number of types this move hits super effectively (coverage value). */
function coverageScore(move: MoveMeta): number {
  return allTypes.reduce((acc, def) => acc + (attackMultiplier(move.type, def) > 1 ? 1 : 0), 0);
}

export function generateBuild(
  detail: PokemonDetail,
  species: SpeciesData | null,
  style: BuildStyle = 'auto'
): SmogonBuild {
  const learnset = new Set(detail.moves);
  const known = movePool.filter((m) => learnset.has(m.id));
  const role = roleForStyle(detail, style);
  const physical =
    style === 'setup'
      ? known.some((m) => m.role === 'setup-physical') &&
        known.some((m) => m.category === 'physical' && m.power > 0)
      : isPhysicalRole(role, detail);
  const attackCategory = physical ? 'physical' : 'special';
  const defensive = role === 'physical_wall' || role === 'special_wall' || role === 'utility_pivot';

  const attacks = known.filter((m) => m.category === attackCategory && m.power > 0);
  const stabType = bestStabType(detail.types);

  const moves: MoveMeta[] = [];
  const used = new Set<string>();
  const add = (m: MoveMeta | undefined) => {
    if (m && !used.has(m.id) && moves.length < 4) {
      used.add(m.id);
      moves.push(m);
    }
  };

  // 1. Primary STAB (favour the better offensive typing)
  const stabMoves = attacks
    .filter((m) => detail.types.includes(m.type))
    .sort((a, b) => (b.type === stabType ? 1 : 0) - (a.type === stabType ? 1 : 0) || b.power - a.power);
  add(stabMoves[0]);
  if (!defensive) add(stabMoves.find((m) => m.type !== moves[0]?.type));

  // 2. Setup / recovery core depending on the role
  if (defensive) {
    add(known.find((m) => m.role === 'recovery'));
    add(known.find((m) => m.role === 'status'));
    add(known.find((m) => m.role === 'hazard'));
    add(known.find((m) => m.role === 'utility' || m.role === 'pivot'));
  } else {
    const setupRole = physical ? 'setup-physical' : 'setup-special';
    if (role === 'setup_sweeper' || (style !== 'choice' && detail.stats.speed < SPEED_FAST)) {
      add(
        known.find((m) => m.role === setupRole) ??
          (style === 'setup'
            ? known.find((m) => m.role === 'setup-physical' || m.role === 'setup-special')
            : undefined)
      );
    }
  }

  // 3. Coverage moves, best power weighted by super-effective coverage
  const coverage = attacks
    .filter((m) => !detail.types.includes(m.type))
    .sort((a, b) => b.power + coverageScore(b) * 4 - (a.power + coverageScore(a) * 4));
  for (const m of coverage) {
    if (moves.length >= 4) break;
    if (moves.some((x) => x.type === m.type)) continue;
    add(m);
  }

  // 4. Fill remaining slots with utility, then any attack
  add(known.find((m) => m.role === 'recovery'));
  add(known.find((m) => m.role === 'utility'));
  for (const m of attacks) {
    if (moves.length >= 4) break;
    add(m);
  }

  // --- EVs / nature / IVs
  const evs: Partial<PokemonStats> = {};
  let nature: string;
  const ivs: Partial<PokemonStats> = {};

  if (defensive) {
    const secondary: keyof PokemonStats =
      role === 'special_wall' ? 'spDefense' : 'defense';
    evs.hp = 252;
    evs[secondary] = 252;
    evs.speed = 4;
    nature = secondary === 'defense' ? 'Bold' : 'Calm';
    if (physical) nature = secondary === 'defense' ? 'Impish' : 'Careful';
    if (!physical) ivs.attack = 0;
  } else if (physical) {
    evs.attack = 252;
    evs.speed = 252;
    evs.hp = 4;
    nature = 'Adamant';
    if (detail.stats.speed >= SPEED_FAST) nature = 'Jolly';
  } else {
    evs.spAttack = 252;
    evs.speed = 252;
    evs.hp = 4;
    nature = 'Modest';
    if (detail.stats.speed >= SPEED_FAST) nature = 'Timid';
    ivs.attack = 0;
  }

  // --- Item
  const hasRecoil = moves.some((m) => ['flare-blitz', 'brave-bird', 'double-edge', 'wild-charge'].includes(m.id));
  let item: string;
  if (style === 'choice') item = physical ? 'Choice Band' : 'Choice Specs';
  else if (defensive) item = 'Leftovers';
  else if (moves.some((m) => m.role === 'setup-physical' || m.role === 'setup-special')) item = 'Leftovers';
  else if (hasRecoil) item = 'Heavy-Duty Boots';
  else if (detail.stats.speed >= 110) item = 'Life Orb';
  else item = physical ? 'Choice Band' : 'Choice Specs';
  if (style !== 'choice' && moves.some((m) => m.role === 'pivot') && !defensive) {
    item = 'Heavy-Duty Boots';
  }

  // --- Ability: prefer the non-hidden one, hidden if it is the only extra
  const ability = detail.abilityDetails.find((a) => !a.isHidden)?.name
    ?? detail.abilities[0]
    ?? 'unknown';

  const tier = estimateTier(detail, species);

  return {
    pokemonId: detail.id,
    format: `Gen 9 ${tier}`,
    ability,
    item,
    nature,
    moves: moves.map((m) => m.name),
    evs,
    ivs: { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31, ...ivs },
    description: '',
    role,
    generated: true,
  };
}

function buildSignature(build: SmogonBuild): string {
  return `${build.item}|${build.nature}|${build.moves.join('|')}`;
}

/**
 * Supplies a second, genuinely different archetype for final-stage Pokémon
 * whose curated data is sparse. Candidates are only offered when the
 * underlying learnset contains the tools that make the archetype meaningful.
 */
export function generateAlternativeBuilds(
  detail: PokemonDetail,
  species: SpeciesData | null
): SmogonBuild[] {
  const primary = generateBuild(detail, species);
  const learnset = new Set(detail.moves);
  const hasSetup = movePool.some(
    (move) =>
      learnset.has(move.id) &&
      (move.role === 'setup-physical' || move.role === 'setup-special')
  );
  const hasUtility = movePool.some(
    (move) =>
      learnset.has(move.id) &&
      (move.role === 'recovery' ||
        move.role === 'status' ||
        move.role === 'hazard' ||
        move.role === 'pivot')
  );
  const styles: BuildStyle[] = hasSetup
    ? ['setup', 'choice']
    : hasUtility
      ? ['utility', 'choice']
      : ['choice'];
  const seen = new Set([buildSignature(primary)]);

  return styles
    .map((style) => generateBuild(detail, species, style))
    .filter((build) => {
      if (build.moves.length < 3) return false;
      const signature = buildSignature(build);
      if (seen.has(signature)) return false;
      seen.add(signature);
      return true;
    });
}

/** Fills IVs and a role label on curated builds so both kinds render identically. */
export function normalizeCuratedBuild(build: SmogonBuild, detail: PokemonDetail): SmogonBuild {
  const physicalSet = (build.evs.attack ?? 0) >= (build.evs.spAttack ?? 0);
  return {
    ...build,
    ivs: build.ivs ?? {
      hp: 31, attack: physicalSet ? 31 : 0, defense: 31, spAttack: 31, spDefense: 31, speed: 31,
    },
    role: build.role ?? (physicalSet ? 'physical_sweeper' : 'special_sweeper'),
    generated: false,
    ability: build.ability || detail.abilities[0] || 'unknown',
  };
}
