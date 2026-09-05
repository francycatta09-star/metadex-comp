export type MoveCategory = 'physical' | 'special' | 'status';

export interface MoveMeta {
  /** PokeAPI slug, e.g. "close-combat" */
  id: string;
  name: string;
  type: string;
  category: MoveCategory;
  power: number;
  /** Utility role used by the build generator */
  role?: 'setup-physical' | 'setup-special' | 'setup-bulk' | 'recovery' | 'status' | 'hazard' | 'pivot' | 'priority' | 'utility';
}

/**
 * Curated pool of competitively relevant moves with the metadata the build
 * generator needs. Intersected with each Pokémon's real learnset from PokeAPI.
 */
export const movePool: MoveMeta[] = [
  // --- Physical attacks
  { id: 'body-slam', name: 'Body Slam', type: 'normal', category: 'physical', power: 85 },
  { id: 'double-edge', name: 'Double-Edge', type: 'normal', category: 'physical', power: 120 },
  { id: 'extreme-speed', name: 'Extreme Speed', type: 'normal', category: 'physical', power: 80, role: 'priority' },
  { id: 'facade', name: 'Facade', type: 'normal', category: 'physical', power: 70 },
  { id: 'return', name: 'Return', type: 'normal', category: 'physical', power: 102 },
  { id: 'flare-blitz', name: 'Flare Blitz', type: 'fire', category: 'physical', power: 120 },
  { id: 'fire-punch', name: 'Fire Punch', type: 'fire', category: 'physical', power: 75 },
  { id: 'waterfall', name: 'Waterfall', type: 'water', category: 'physical', power: 80 },
  { id: 'liquidation', name: 'Liquidation', type: 'water', category: 'physical', power: 85 },
  { id: 'aqua-jet', name: 'Aqua Jet', type: 'water', category: 'physical', power: 40, role: 'priority' },
  { id: 'wild-charge', name: 'Wild Charge', type: 'electric', category: 'physical', power: 90 },
  { id: 'thunder-punch', name: 'Thunder Punch', type: 'electric', category: 'physical', power: 75 },
  { id: 'power-whip', name: 'Power Whip', type: 'grass', category: 'physical', power: 120 },
  { id: 'leaf-blade', name: 'Leaf Blade', type: 'grass', category: 'physical', power: 90 },
  { id: 'seed-bomb', name: 'Seed Bomb', type: 'grass', category: 'physical', power: 80 },
  { id: 'icicle-crash', name: 'Icicle Crash', type: 'ice', category: 'physical', power: 85 },
  { id: 'ice-punch', name: 'Ice Punch', type: 'ice', category: 'physical', power: 75 },
  { id: 'icicle-spear', name: 'Icicle Spear', type: 'ice', category: 'physical', power: 75 },
  { id: 'close-combat', name: 'Close Combat', type: 'fighting', category: 'physical', power: 120 },
  { id: 'drain-punch', name: 'Drain Punch', type: 'fighting', category: 'physical', power: 75 },
  { id: 'mach-punch', name: 'Mach Punch', type: 'fighting', category: 'physical', power: 40, role: 'priority' },
  { id: 'brick-break', name: 'Brick Break', type: 'fighting', category: 'physical', power: 75 },
  { id: 'gunk-shot', name: 'Gunk Shot', type: 'poison', category: 'physical', power: 120 },
  { id: 'poison-jab', name: 'Poison Jab', type: 'poison', category: 'physical', power: 80 },
  { id: 'earthquake', name: 'Earthquake', type: 'ground', category: 'physical', power: 100 },
  { id: 'high-horsepower', name: 'High Horsepower', type: 'ground', category: 'physical', power: 95 },
  { id: 'brave-bird', name: 'Brave Bird', type: 'flying', category: 'physical', power: 120 },
  { id: 'dual-wingbeat', name: 'Dual Wingbeat', type: 'flying', category: 'physical', power: 80 },
  { id: 'zen-headbutt', name: 'Zen Headbutt', type: 'psychic', category: 'physical', power: 80 },
  { id: 'psycho-cut', name: 'Psycho Cut', type: 'psychic', category: 'physical', power: 70 },
  { id: 'u-turn', name: 'U-turn', type: 'bug', category: 'physical', power: 70, role: 'pivot' },
  { id: 'megahorn', name: 'Megahorn', type: 'bug', category: 'physical', power: 120 },
  { id: 'first-impression', name: 'First Impression', type: 'bug', category: 'physical', power: 90, role: 'priority' },
  { id: 'stone-edge', name: 'Stone Edge', type: 'rock', category: 'physical', power: 100 },
  { id: 'rock-slide', name: 'Rock Slide', type: 'rock', category: 'physical', power: 75 },
  { id: 'poltergeist', name: 'Poltergeist', type: 'ghost', category: 'physical', power: 110 },
  { id: 'shadow-claw', name: 'Shadow Claw', type: 'ghost', category: 'physical', power: 70 },
  { id: 'shadow-sneak', name: 'Shadow Sneak', type: 'ghost', category: 'physical', power: 40, role: 'priority' },
  { id: 'outrage', name: 'Outrage', type: 'dragon', category: 'physical', power: 120 },
  { id: 'dragon-claw', name: 'Dragon Claw', type: 'dragon', category: 'physical', power: 80 },
  { id: 'crunch', name: 'Crunch', type: 'dark', category: 'physical', power: 80 },
  { id: 'knock-off', name: 'Knock Off', type: 'dark', category: 'physical', power: 65, role: 'utility' },
  { id: 'sucker-punch', name: 'Sucker Punch', type: 'dark', category: 'physical', power: 70, role: 'priority' },
  { id: 'iron-head', name: 'Iron Head', type: 'steel', category: 'physical', power: 80 },
  { id: 'heavy-slam', name: 'Heavy Slam', type: 'steel', category: 'physical', power: 100 },
  { id: 'play-rough', name: 'Play Rough', type: 'fairy', category: 'physical', power: 90 },

  // --- Special attacks
  { id: 'hyper-voice', name: 'Hyper Voice', type: 'normal', category: 'special', power: 90 },
  { id: 'tri-attack', name: 'Tri Attack', type: 'normal', category: 'special', power: 80 },
  { id: 'fire-blast', name: 'Fire Blast', type: 'fire', category: 'special', power: 110 },
  { id: 'flamethrower', name: 'Flamethrower', type: 'fire', category: 'special', power: 90 },
  { id: 'hydro-pump', name: 'Hydro Pump', type: 'water', category: 'special', power: 110 },
  { id: 'surf', name: 'Surf', type: 'water', category: 'special', power: 90 },
  { id: 'scald', name: 'Scald', type: 'water', category: 'special', power: 80 },
  { id: 'thunder', name: 'Thunder', type: 'electric', category: 'special', power: 110 },
  { id: 'thunderbolt', name: 'Thunderbolt', type: 'electric', category: 'special', power: 90 },
  { id: 'volt-switch', name: 'Volt Switch', type: 'electric', category: 'special', power: 70, role: 'pivot' },
  { id: 'leaf-storm', name: 'Leaf Storm', type: 'grass', category: 'special', power: 130 },
  { id: 'energy-ball', name: 'Energy Ball', type: 'grass', category: 'special', power: 90 },
  { id: 'giga-drain', name: 'Giga Drain', type: 'grass', category: 'special', power: 75 },
  { id: 'ice-beam', name: 'Ice Beam', type: 'ice', category: 'special', power: 90 },
  { id: 'blizzard', name: 'Blizzard', type: 'ice', category: 'special', power: 110 },
  { id: 'freeze-dry', name: 'Freeze-Dry', type: 'ice', category: 'special', power: 70 },
  { id: 'aura-sphere', name: 'Aura Sphere', type: 'fighting', category: 'special', power: 80 },
  { id: 'focus-blast', name: 'Focus Blast', type: 'fighting', category: 'special', power: 120 },
  { id: 'vacuum-wave', name: 'Vacuum Wave', type: 'fighting', category: 'special', power: 40, role: 'priority' },
  { id: 'sludge-bomb', name: 'Sludge Bomb', type: 'poison', category: 'special', power: 90 },
  { id: 'sludge-wave', name: 'Sludge Wave', type: 'poison', category: 'special', power: 95 },
  { id: 'earth-power', name: 'Earth Power', type: 'ground', category: 'special', power: 90 },
  { id: 'air-slash', name: 'Air Slash', type: 'flying', category: 'special', power: 75 },
  { id: 'hurricane', name: 'Hurricane', type: 'flying', category: 'special', power: 110 },
  { id: 'psychic', name: 'Psychic', type: 'psychic', category: 'special', power: 90 },
  { id: 'psyshock', name: 'Psyshock', type: 'psychic', category: 'special', power: 80 },
  { id: 'stored-power', name: 'Stored Power', type: 'psychic', category: 'special', power: 80 },
  { id: 'bug-buzz', name: 'Bug Buzz', type: 'bug', category: 'special', power: 90 },
  { id: 'power-gem', name: 'Power Gem', type: 'rock', category: 'special', power: 80 },
  { id: 'shadow-ball', name: 'Shadow Ball', type: 'ghost', category: 'special', power: 80 },
  { id: 'hex', name: 'Hex', type: 'ghost', category: 'special', power: 65 },
  { id: 'draco-meteor', name: 'Draco Meteor', type: 'dragon', category: 'special', power: 130 },
  { id: 'dragon-pulse', name: 'Dragon Pulse', type: 'dragon', category: 'special', power: 85 },
  { id: 'dark-pulse', name: 'Dark Pulse', type: 'dark', category: 'special', power: 80 },
  { id: 'flash-cannon', name: 'Flash Cannon', type: 'steel', category: 'special', power: 80 },
  { id: 'moonblast', name: 'Moonblast', type: 'fairy', category: 'special', power: 95 },
  { id: 'dazzling-gleam', name: 'Dazzling Gleam', type: 'fairy', category: 'special', power: 80 },

  // --- Setup
  { id: 'swords-dance', name: 'Swords Dance', type: 'normal', category: 'status', power: 0, role: 'setup-physical' },
  { id: 'dragon-dance', name: 'Dragon Dance', type: 'dragon', category: 'status', power: 0, role: 'setup-physical' },
  { id: 'bulk-up', name: 'Bulk Up', type: 'fighting', category: 'status', power: 0, role: 'setup-physical' },
  { id: 'shell-smash', name: 'Shell Smash', type: 'normal', category: 'status', power: 0, role: 'setup-physical' },
  { id: 'nasty-plot', name: 'Nasty Plot', type: 'dark', category: 'status', power: 0, role: 'setup-special' },
  { id: 'calm-mind', name: 'Calm Mind', type: 'psychic', category: 'status', power: 0, role: 'setup-special' },
  { id: 'quiver-dance', name: 'Quiver Dance', type: 'bug', category: 'status', power: 0, role: 'setup-special' },
  { id: 'iron-defense', name: 'Iron Defense', type: 'steel', category: 'status', power: 0, role: 'setup-bulk' },
  { id: 'agility', name: 'Agility', type: 'psychic', category: 'status', power: 0, role: 'setup-bulk' },

  // --- Recovery
  { id: 'recover', name: 'Recover', type: 'normal', category: 'status', power: 0, role: 'recovery' },
  { id: 'roost', name: 'Roost', type: 'flying', category: 'status', power: 0, role: 'recovery' },
  { id: 'soft-boiled', name: 'Soft-Boiled', type: 'normal', category: 'status', power: 0, role: 'recovery' },
  { id: 'synthesis', name: 'Synthesis', type: 'grass', category: 'status', power: 0, role: 'recovery' },
  { id: 'moonlight', name: 'Moonlight', type: 'fairy', category: 'status', power: 0, role: 'recovery' },
  { id: 'morning-sun', name: 'Morning Sun', type: 'normal', category: 'status', power: 0, role: 'recovery' },
  { id: 'slack-off', name: 'Slack Off', type: 'normal', category: 'status', power: 0, role: 'recovery' },
  { id: 'rest', name: 'Rest', type: 'psychic', category: 'status', power: 0, role: 'recovery' },
  { id: 'wish', name: 'Wish', type: 'normal', category: 'status', power: 0, role: 'recovery' },
  { id: 'pain-split', name: 'Pain Split', type: 'normal', category: 'status', power: 0, role: 'recovery' },
  { id: 'leech-seed', name: 'Leech Seed', type: 'grass', category: 'status', power: 0, role: 'recovery' },

  // --- Status / utility
  { id: 'will-o-wisp', name: 'Will-O-Wisp', type: 'fire', category: 'status', power: 0, role: 'status' },
  { id: 'thunder-wave', name: 'Thunder Wave', type: 'electric', category: 'status', power: 0, role: 'status' },
  { id: 'toxic', name: 'Toxic', type: 'poison', category: 'status', power: 0, role: 'status' },
  { id: 'glare', name: 'Glare', type: 'normal', category: 'status', power: 0, role: 'status' },
  { id: 'sleep-powder', name: 'Sleep Powder', type: 'grass', category: 'status', power: 0, role: 'status' },
  { id: 'spore', name: 'Spore', type: 'grass', category: 'status', power: 0, role: 'status' },
  { id: 'taunt', name: 'Taunt', type: 'dark', category: 'status', power: 0, role: 'utility' },
  { id: 'substitute', name: 'Substitute', type: 'normal', category: 'status', power: 0, role: 'utility' },
  { id: 'protect', name: 'Protect', type: 'normal', category: 'status', power: 0, role: 'utility' },
  { id: 'defog', name: 'Defog', type: 'flying', category: 'status', power: 0, role: 'utility' },
  { id: 'rapid-spin', name: 'Rapid Spin', type: 'normal', category: 'physical', power: 50, role: 'utility' },
  { id: 'stealth-rock', name: 'Stealth Rock', type: 'rock', category: 'status', power: 0, role: 'hazard' },
  { id: 'spikes', name: 'Spikes', type: 'ground', category: 'status', power: 0, role: 'hazard' },
  { id: 'toxic-spikes', name: 'Toxic Spikes', type: 'poison', category: 'status', power: 0, role: 'hazard' },
  { id: 'teleport', name: 'Teleport', type: 'psychic', category: 'status', power: 0, role: 'pivot' },
];

export const movePoolById: Record<string, MoveMeta> = Object.fromEntries(
  movePool.map((m) => [m.id, m])
);
