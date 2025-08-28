import { BUILDINGS } from "./buildings.enum";

export type CellSize = { w: number; h: number };

export interface BuildingSpec {
  id: BUILDINGS;
  buildPrice: number;    // 💲 стоимость постройки
  launchPrice: number;   // ⚡ стоимость запуска (0 если нет)
  size: CellSize;        // 1×1 или 3×3 для ядерки
  hp: number;            // прочность
  buildTime: number;     // ⏱ время постройки в секундах (0 = мгновенно)
}
