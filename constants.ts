
import { Building, BuildingUpgrade, Race, Resources, Talent, Unit, RaceId } from './types';

export const TICK_RATE_MS = 1000;
export const SAVE_KEY = 'azeroth-idle-alliance-v3'; // Bumped version for talents

export const INITIAL_RESOURCES: Resources = {
  gold: 0,
  wood: 0,
  ore: 0,
};

export const DEFAULT_BUILDING_UPGRADES: BuildingUpgrade[] = [
  { id: 'upgrade_10', threshold: 10, multiplier: 1.5, icon: 'Sparkles' },
  { id: 'upgrade_25', threshold: 25, multiplier: 1.6, icon: 'Medal' },
  { id: 'upgrade_50', threshold: 50, multiplier: 1.8, icon: 'Gem' },
  { id: 'upgrade_75', threshold: 75, multiplier: 2.0, icon: 'Flame' },
  { id: 'upgrade_100', threshold: 100, multiplier: 2.2, icon: 'Crown' },
];

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
    baseCost: { gold: 8 },
    production: { wood: 1 },
    costMultiplier: 1.35,
    count: 0,
    icon: 'Pickaxe', // Represents the peasant's tool
    upgrades: DEFAULT_BUILDING_UPGRADES,
    purchasedUpgrades: [],
  },
  {
    id: 'lumber_mill',
    name: 'Lumber Mill',
    description: 'Processes timber from the surrounding forests.',
    baseCost: { gold: 35, wood: 15 },
    production: { wood: 5 },
    costMultiplier: 1.4,
    count: 0,
    icon: 'Axe',
    upgrades: DEFAULT_BUILDING_UPGRADES,
    purchasedUpgrades: [],
  },
  {
    id: 'blacksmith',
    name: 'Blacksmith',
    description: 'Forges weapons and armor for the soldiers.',
    baseCost: { wood: 120, gold: 80 },
    production: { ore: 2 },
    costMultiplier: 1.3,
    count: 0,
    icon: 'Hammer', // Anvil/Hammer vibe
    upgrades: DEFAULT_BUILDING_UPGRADES,
    purchasedUpgrades: [],
  },
  {
    id: 'inn',
    name: 'Inn',
    description: 'A place of rest. Generates Gold from travelers.',
    baseCost: { wood: 280, ore: 80 },
    production: { gold: 5 },
    costMultiplier: 1.4,
    count: 0,
    icon: 'Store', // Beer/Inn vibe
    upgrades: DEFAULT_BUILDING_UPGRADES,
    purchasedUpgrades: [],
  },
  {
    id: 'barracks',
    name: 'Barracks',
    description: 'Trains footmen who return with loot from monsters.',
    baseCost: { gold: 800, wood: 650, ore: 240 },
    production: { gold: 15 },
    costMultiplier: 1.5,
    count: 0,
    icon: 'Shield', 
    upgrades: DEFAULT_BUILDING_UPGRADES,
    purchasedUpgrades: [],
  },
  {
    id: 'mage_tower',
    name: 'Mage Tower',
    description: 'The Arcane Arts transmute matter into value.',
    baseCost: { gold: 3800, ore: 1500 },
    production: { ore: 20, gold: 20, wood: 20 },
    costMultiplier: 1.6,
    count: 0,
    icon: 'Flame', // Magic vibe
    upgrades: DEFAULT_BUILDING_UPGRADES,
    purchasedUpgrades: [],
  },
];

export const getInitialBuildingsState = (): Building[] => 
  INITIAL_BUILDINGS.map(b => ({
    ...b,
    purchasedUpgrades: [],
    count: 0,
  }));

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

const HUMAN_UNITS: Unit[] = [
  { id: 'human_footman', name: 'Footman', description: 'Shielded soldier of Stormwind.', baseCost: { gold: 150, wood: 40 }, costMultiplier: 1.35, count: 0, icon: 'Shield', role: 'melee', attack: 15, defense: 10, health: 120 },
  { id: 'human_rifleman', name: 'Rifleman', description: 'Ranged support with high accuracy.', baseCost: { gold: 140, wood: 80 }, costMultiplier: 1.4, count: 0, icon: 'Target', role: 'ranged', attack: 22, defense: 6, health: 90 },
  { id: 'human_mage', name: 'Battle Mage', description: 'Harnesses arcane power to obliterate foes.', baseCost: { gold: 200, ore: 100 }, costMultiplier: 1.45, count: 0, icon: 'Sparkles', role: 'caster', attack: 30, defense: 5, health: 70 },
  { id: 'human_gryphon', name: 'Gryphon Rider', description: 'Aerial unit striking from above.', baseCost: { gold: 320, wood: 160, ore: 80 }, costMultiplier: 1.5, count: 0, icon: 'Bird', role: 'flying', attack: 28, defense: 12, health: 110 },
  { id: 'human_siege', name: 'Siege Engine', description: 'Heavy tank for demolishing fortifications.', baseCost: { gold: 420, wood: 220, ore: 180 }, costMultiplier: 1.55, count: 0, icon: 'Truck', role: 'siege', attack: 40, defense: 25, health: 300 },
];

const DWARF_UNITS: Unit[] = [
  { id: 'dwarf_mountaineer', name: 'Mountaineer', description: 'Stout melee defender.', baseCost: { gold: 130, wood: 50 }, costMultiplier: 1.35, count: 0, icon: 'Pickaxe', role: 'melee', attack: 16, defense: 14, health: 140 },
  { id: 'dwarf_rifle', name: 'Rifle Corps', description: 'Deadly precision with firearms.', baseCost: { gold: 160, wood: 70, ore: 30 }, costMultiplier: 1.4, count: 0, icon: 'Crosshair', role: 'ranged', attack: 24, defense: 8, health: 95 },
  { id: 'dwarf_runepriest', name: 'Rune Priest', description: 'Runic caster bolstering the ranks.', baseCost: { gold: 210, ore: 120 }, costMultiplier: 1.45, count: 0, icon: 'Flame', role: 'caster', attack: 26, defense: 7, health: 85 },
  { id: 'dwarf_gyro', name: 'Gyrocopter', description: 'Flying machine with bombs.', baseCost: { gold: 280, wood: 140, ore: 140 }, costMultiplier: 1.5, count: 0, icon: 'Plane', role: 'flying', attack: 27, defense: 11, health: 125 },
  { id: 'dwarf_siege', name: 'Siege Tank', description: 'Steam-powered armor that shreds walls.', baseCost: { gold: 450, wood: 200, ore: 220 }, costMultiplier: 1.55, count: 0, icon: 'Shield', role: 'siege', attack: 42, defense: 28, health: 320 },
];

const NELF_UNITS: Unit[] = [
  { id: 'nelf_sentinel', name: 'Sentinel', description: 'Agile frontliner of the Sisterhood.', baseCost: { gold: 120, wood: 60 }, costMultiplier: 1.35, count: 0, icon: 'Swords', role: 'melee', attack: 17, defense: 11, health: 110 },
  { id: 'nelf_archer', name: 'Archer', description: 'Silent ranged eliminator.', baseCost: { gold: 110, wood: 90 }, costMultiplier: 1.4, count: 0, icon: 'Crosshair', role: 'ranged', attack: 23, defense: 7, health: 85 },
  { id: 'nelf_druid', name: 'Druid', description: 'Nature magic and healing.', baseCost: { gold: 190, wood: 80, ore: 60 }, costMultiplier: 1.45, count: 0, icon: 'Leaf', role: 'caster', attack: 24, defense: 9, health: 80 },
  { id: 'nelf_hippo', name: 'Hippogryph Rider', description: 'Swift aerial strike unit.', baseCost: { gold: 260, wood: 180, ore: 60 }, costMultiplier: 1.5, count: 0, icon: 'Bird', role: 'flying', attack: 26, defense: 12, health: 115 },
  { id: 'nelf_ancient', name: 'Ancient Protector', description: 'Living siege golem of the forest.', baseCost: { gold: 380, wood: 260, ore: 140 }, costMultiplier: 1.55, count: 0, icon: 'Trees', role: 'siege', attack: 38, defense: 26, health: 290 },
];

const GNOME_UNITS: Unit[] = [
  { id: 'gnome_tinkerer', name: 'Tinkerer', description: 'Gadgeteer with explosive surprises.', baseCost: { gold: 130, wood: 50 }, costMultiplier: 1.35, count: 0, icon: 'Cog', role: 'melee', attack: 15, defense: 9, health: 105 },
  { id: 'gnome_gunner', name: 'Gunner', description: 'Rapid-fire mechanized shooter.', baseCost: { gold: 150, wood: 70, ore: 40 }, costMultiplier: 1.4, count: 0, icon: 'Zap', role: 'ranged', attack: 25, defense: 6, health: 85 },
  { id: 'gnome_arcanist', name: 'Arcanist', description: 'Tech-infused sorcery.', baseCost: { gold: 200, ore: 110 }, costMultiplier: 1.45, count: 0, icon: 'Sparkles', role: 'caster', attack: 28, defense: 7, health: 75 },
  { id: 'gnome_copter', name: 'Copter Pilot', description: 'Experimental rotorcraft strike unit.', baseCost: { gold: 240, wood: 150, ore: 90 }, costMultiplier: 1.5, count: 0, icon: 'Plane', role: 'flying', attack: 27, defense: 10, health: 120 },
  { id: 'gnome_mech', name: 'War Mech', description: 'Heavy golem suit with cannons.', baseCost: { gold: 420, wood: 210, ore: 220 }, costMultiplier: 1.55, count: 0, icon: 'Bot', role: 'siege', attack: 44, defense: 24, health: 310 },
];

export const getInitialUnitsForRace = (raceId: RaceId | null): Unit[] => {
  switch (raceId) {
    case 'human': return HUMAN_UNITS.map(u => ({ ...u, count: 0 }));
    case 'dwarf': return DWARF_UNITS.map(u => ({ ...u, count: 0 }));
    case 'nelf': return NELF_UNITS.map(u => ({ ...u, count: 0 }));
    case 'gnome': return GNOME_UNITS.map(u => ({ ...u, count: 0 }));
    default: return [];
  }
};
