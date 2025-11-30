
import { Building, Race, Resources, Talent } from './types';

export const TICK_RATE_MS = 1000;
export const SAVE_KEY = 'azeroth-idle-alliance-v3'; // Bumped version for talents

export const INITIAL_RESOURCES: Resources = {
  gold: 0,
  wood: 0,
  ore: 0,
};

export const RACES: Race[] = [
  {
    id: 'human',
    name: 'Human',
    description: 'The noble defenders of Stormwind. Versatile and diplomatic.',
    bonusDescription: '+10% Gold Production',
    icon: 'Shield',
    woodLabel: 'Elwynn Forest',
    oreLabel: 'Jasperlode Mine',
    goldLabel: 'Trade District'
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    description: 'Stout mountaineers of Ironforge. Masters of stone and steel.',
    bonusDescription: '+10% Ore Production',
    icon: 'Hammer',
    woodLabel: 'Dun Morogh Pines',
    oreLabel: 'Great Forge',
    goldLabel: 'The Commons'
  },
  {
    id: 'nelf',
    name: 'Night Elf',
    description: 'Ancient protectors of nature from Teldrassil.',
    bonusDescription: '+10% Wood Production',
    icon: 'Trees',
    woodLabel: 'Teldrassil',
    oreLabel: 'Darkshore Cave',
    goldLabel: 'Temple of Moon'
  },
  {
    id: 'gnome',
    name: 'Gnome',
    description: 'Eccentric inventors of Gnomeregan. Small but brilliant.',
    bonusDescription: 'Buildings are 10% cheaper',
    icon: 'Zap', // Representing technology
    woodLabel: 'Dun Morogh',
    oreLabel: 'Gnomeregan',
    goldLabel: 'Tinker Town'
  }
];

export const INITIAL_BUILDINGS: Building[] = [
  {
    id: 'peasant',
    name: 'Laborer',
    description: '"Ready to work!" A simple laborer of the Alliance.',
    baseCost: { gold: 10 },
    production: { wood: 1 },
    costMultiplier: 1.5,
    count: 0,
    icon: 'Pickaxe', // Represents the peasant's tool
  },
  {
    id: 'lumber_mill',
    name: 'Lumber Mill',
    description: 'Processes timber from the surrounding forests.',
    baseCost: { gold: 50, wood: 25 },
    production: { wood: 5 },
    costMultiplier: 1.6,
    count: 0,
    icon: 'Axe',
  },
  {
    id: 'blacksmith',
    name: 'Blacksmith',
    description: 'Forges weapons and armor for the soldiers.',
    baseCost: { wood: 150, gold: 100 },
    production: { ore: 2 },
    costMultiplier: 1.4,
    count: 0,
    icon: 'Hammer', // Anvil/Hammer vibe
  },
  {
    id: 'inn',
    name: 'Inn',
    description: 'A place of rest. Generates Gold from travelers.',
    baseCost: { wood: 400, ore: 100 },
    production: { gold: 5 },
    costMultiplier: 1.5,
    count: 0,
    icon: 'Store', // Beer/Inn vibe
  },
  {
    id: 'barracks',
    name: 'Barracks',
    description: 'Trains footmen who return with loot from monsters.',
    baseCost: { gold: 1000, wood: 800, ore: 300 },
    production: { gold: 15 },
    costMultiplier: 1.6,
    count: 0,
    icon: 'Shield', 
  },
  {
    id: 'mage_tower',
    name: 'Mage Tower',
    description: 'The Arcane Arts transmute matter into value.',
    baseCost: { gold: 5000, ore: 2000 },
    production: { ore: 20, gold: 20, wood: 20 },
    costMultiplier: 1.8,
    count: 0,
    icon: 'Flame', // Magic vibe
  },
];

export const TALENTS: Talent[] = [
  {
    id: 'kings_honor',
    name: "King's Honor",
    description: "Increases ALL resource production by 5% per level.",
    baseCost: 1,
    costMultiplier: 2,
    icon: 'Crown'
  },
  {
    id: 'peon_union',
    name: "Workers Union",
    description: "Manual gathering (clicking) is 20% more effective per level.",
    baseCost: 2,
    costMultiplier: 1.5,
    icon: 'Hand'
  },
  {
    id: 'deep_mining',
    name: "Deep Mining",
    description: "Increases Ore production by an additional 10% per level.",
    baseCost: 3,
    costMultiplier: 1.8,
    icon: 'Mountain'
  },
  {
    id: 'elven_grace',
    name: "Elven Grace",
    description: "Increases Wood production by an additional 10% per level.",
    baseCost: 3,
    costMultiplier: 1.8,
    icon: 'Leaf'
  },
  {
    id: 'goblin_deals',
    name: "Trade Agreements",
    description: "Increases Gold production by an additional 10% per level.",
    baseCost: 3,
    costMultiplier: 1.8,
    icon: 'Scroll'
  }
];
