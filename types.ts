
export type ResourceType = 'gold' | 'wood' | 'ore';

export type RaceId = 'human' | 'dwarf' | 'nelf' | 'gnome';

export interface Resources {
  gold: number;
  wood: number;
  ore: number;
}

export interface Race {
  id: RaceId;
  name: string;
  description: string;
  bonusDescription: string;
  icon: string; // Lucide icon name
  // Flavor text
  woodLabel: string;
  oreLabel: string;
  goldLabel: string;
}

export interface BuildingCost {
  gold?: number;
  wood?: number;
  ore?: number;
}

export interface BuildingProduction {
  gold?: number;
  wood?: number;
  ore?: number;
}

export interface BuildingUpgrade {
  id: string;
  threshold: number;
  multiplier: number;
  icon: string;
}

export interface Building {
  id: string;
  name: string;
  description: string;
  baseCost: BuildingCost;
  production: BuildingProduction;
  costMultiplier: number; // Cost increases by this factor per level
  count: number;
  icon: string; // Lucide icon name placeholder
  upgrades?: BuildingUpgrade[];
  purchasedUpgrades?: string[];
}

export interface Unit {
  id: string;
  name: string;
  description: string;
  baseCost: BuildingCost;
  costMultiplier: number;
  count: number;
  icon: string;
  role: 'melee' | 'ranged' | 'caster' | 'flying' | 'siege';
  attack: number;
  health: number;
}

export interface Talent {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  maxLevel?: number;
  icon: string;
}

export interface GameState {
  resources: Resources;
  buildings: Building[];
  units: Unit[];
  lastTick: number;
  race: RaceId | null;
  eternalEssence: number;
  talents: Record<string, number>; // TalentID -> Level
}
