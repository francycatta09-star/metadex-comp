export interface Region {
  gen: number;
  id: string;
  range: [number, number];
}

export const regions: Region[] = [
  { gen: 1, id: 'kanto', range: [1, 151] },
  { gen: 2, id: 'johto', range: [152, 251] },
  { gen: 3, id: 'hoenn', range: [252, 386] },
  { gen: 4, id: 'sinnoh', range: [387, 493] },
  { gen: 5, id: 'unova', range: [494, 649] },
  { gen: 6, id: 'kalos', range: [650, 721] },
  { gen: 7, id: 'alola', range: [722, 809] },
  { gen: 8, id: 'galar', range: [810, 905] },
  { gen: 9, id: 'paldea', range: [906, 1025] },
];

export function getGeneration(id: number): number {
  for (const r of regions) {
    if (id >= r.range[0] && id <= r.range[1]) return r.gen;
  }
  return 1;
}

export const MAX_POKEMON_ID = 1025;
