import { BUILDINGS } from "./buildings.enum";
import { BuildingSpec } from "./building.types";

export const BUILDINGS_DATA: Record<BUILDINGS, BuildingSpec> = {
  [BUILDINGS.HQ]: {
    id: BUILDINGS.HQ,
    buildPrice: 0,
    launchPrice: 0,
    size: { w: 1, h: 1 },
    hp: 170,
    buildTime: 0, // штаб мгновенно
  },
  [BUILDINGS.MISSILE_LAUNCHER]: {
    id: BUILDINGS.MISSILE_LAUNCHER,
    buildPrice: 10,
    launchPrice: 4,  // ⚡ пуск
    size: { w: 1, h: 1 },
    hp: 20,
    buildTime: 13,
  },
  [BUILDINGS.AIR_DEFENSE]: {
    id: BUILDINGS.AIR_DEFENSE,
    buildPrice: 15,
    launchPrice: 0,
    size: { w: 1, h: 1 },
    hp: 20,
    buildTime: 26,
  },
  [BUILDINGS.ANTI_PERSONNEL_WEAPONS]: {
    id: BUILDINGS.ANTI_PERSONNEL_WEAPONS,
    buildPrice: 10,
    launchPrice: 0,
    size: { w: 1, h: 1 },
    hp: 70,
    buildTime: 15,
  },
  [BUILDINGS.RADAR]: {
    id: BUILDINGS.RADAR,
    buildPrice: 50,
    launchPrice: 0,
    size: { w: 1, h: 1 },
    hp: 20,
    buildTime: 26,
  },
  [BUILDINGS.FACTORY]: {
    id: BUILDINGS.FACTORY,
    buildPrice: 75,
    launchPrice: 0,
    size: { w: 1, h: 1 },
    hp: 40,
    buildTime: 27,
  },
  [BUILDINGS.MINE]: {
    id: BUILDINGS.MINE,
    buildPrice: 75,
    launchPrice: 0,
    size: { w: 1, h: 1 },
    hp: 40,
    buildTime: 28,
  },
  [BUILDINGS.POWER_PLANT]: {
    id: BUILDINGS.POWER_PLANT,
    buildPrice: 75,
    launchPrice: 0,
    size: { w: 1, h: 1 },
    hp: 40,
    buildTime: 27,
  },
  [BUILDINGS.NUCLEAR_SILO]: {
    id: BUILDINGS.NUCLEAR_SILO,
    buildPrice: 255,
    launchPrice: 950, // ⚡ пуск ядерки
    size: { w: 3, h: 3 },
    hp: 20,
    buildTime: 240,   // ~4 мин = 240 сек
  },
  [BUILDINGS.MINEFIELD]: {
    id: BUILDINGS.MINEFIELD,
    buildPrice: 10,
    launchPrice: 0,
    size: { w: 1, h: 1 },
    hp: 20,
    buildTime: 2,
  },
  [BUILDINGS.MARINE_CORPS]: {
    id: BUILDINGS.MARINE_CORPS,
    buildPrice: 20,
    launchPrice: 20, // ⚡ пуск десанта
    size: { w: 1, h: 1 },
    hp: 40,
    buildTime: 18,
  },
};
