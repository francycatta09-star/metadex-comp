import { allTypes } from '@/pokedex/data/typeInfo';

// Attacking type -> defending type -> multiplier (only non-1x entries listed)
const chart: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: {
    fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5,
    bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5,
  },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: {
    normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5,
    rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5,
  },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: {
    fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2,
    ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5,
  },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export function attackMultiplier(attacking: string, defending: string): number {
  return chart[attacking]?.[defending] ?? 1;
}

export interface DefensiveProfile {
  quadWeak: string[];
  weak: string[];
  resist: string[];
  quadResist: string[];
  immune: string[];
}

/** How each attacking type fares against the given defensive typing. */
export function getDefensiveProfile(types: string[]): DefensiveProfile {
  const profile: DefensiveProfile = {
    quadWeak: [], weak: [], resist: [], quadResist: [], immune: [],
  };

  for (const atk of allTypes) {
    let mult = 1;
    for (const def of types) mult *= attackMultiplier(atk, def);
    if (mult === 0) profile.immune.push(atk);
    else if (mult >= 4) profile.quadWeak.push(atk);
    else if (mult > 1) profile.weak.push(atk);
    else if (mult <= 0.25) profile.quadResist.push(atk);
    else if (mult < 1) profile.resist.push(atk);
  }

  return profile;
}

/** Best offensive STAB type of the given typing, by number of types hit super-effectively. */
export function bestStabType(types: string[]): string {
  let best = types[0] ?? 'normal';
  let bestScore = -1;
  for (const tp of types) {
    const score = allTypes.reduce((acc, def) => acc + (attackMultiplier(tp, def) > 1 ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = tp;
    }
  }
  return best;
}
