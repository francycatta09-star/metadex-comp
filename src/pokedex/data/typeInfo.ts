import type { TypeInfo } from '@/pokedex/types';

export const typeInfo: Record<string, TypeInfo> = {
  normal:   { name: 'Normal',   color: '#A8A878', textColor: '#ffffff', icon: 'Star' },
  fire:     { name: 'Fire',     color: '#F08030', textColor: '#ffffff', icon: 'Flame' },
  water:    { name: 'Water',    color: '#6890F0', textColor: '#ffffff', icon: 'Droplet' },
  electric: { name: 'Electric', color: '#F8D030', textColor: '#1a1a1a', icon: 'Zap' },
  grass:    { name: 'Grass',    color: '#78C850', textColor: '#ffffff', icon: 'Leaf' },
  ice:      { name: 'Ice',      color: '#98D8D8', textColor: '#1a1a1a', icon: 'Snowflake' },
  fighting: { name: 'Fighting', color: '#C03028', textColor: '#ffffff', icon: 'Swords' },
  poison:   { name: 'Poison',   color: '#A040A0', textColor: '#ffffff', icon: 'Skull' },
  ground:   { name: 'Ground',   color: '#E0C068', textColor: '#1a1a1a', icon: 'Mountain' },
  flying:   { name: 'Flying',   color: '#A890F0', textColor: '#ffffff', icon: 'Feather' },
  psychic:  { name: 'Psychic',  color: '#F85888', textColor: '#ffffff', icon: 'Brain' },
  bug:      { name: 'Bug',      color: '#A8B820', textColor: '#ffffff', icon: 'Bug' },
  rock:     { name: 'Rock',     color: '#B8A038', textColor: '#ffffff', icon: 'Gem' },
  ghost:    { name: 'Ghost',    color: '#705898', textColor: '#ffffff', icon: 'Ghost' },
  dragon:   { name: 'Dragon',   color: '#7038F8', textColor: '#ffffff', icon: 'Hexagon' },
  dark:     { name: 'Dark',     color: '#705848', textColor: '#ffffff', icon: 'Moon' },
  steel:    { name: 'Steel',    color: '#B8B8D0', textColor: '#1a1a1a', icon: 'Shield' },
  fairy:    { name: 'Fairy',    color: '#EE99AC', textColor: '#1a1a1a', icon: 'Sparkles' },
};

export const statColors: Record<string, string> = {
  hp: '#34d399',
  attack: '#f87171',
  defense: '#fbbf24',
  spAttack: '#60a5fa',
  spDefense: '#a78bfa',
  speed: '#fb923c',
};

export const allTypes = Object.keys(typeInfo);
