// db://assets/game/grid/GridManager.ts
import { _decorator, Component, TiledMap, TiledLayer, Vec2, Vec3 } from 'cc';
import { CELL_STATE } from 'db://assets/vendor/sim-core/grid';
const { ccclass, property } = _decorator;

@ccclass('GridManager')
export class GridManager extends Component {
  @property({ type: TiledMap, tooltip: 'Ссылка на TiledMap (обязательная)' })
  tiled: TiledMap = null!;

  @property({ type: String, tooltip: 'Слой, из которого читаем флаг buildable' })
  buildableLayerName: string = 'Ground';

  @property({ type: String, tooltip: 'Имя свойства тайла в Tileset (buildable=true/false)' })
  buildablePropName: string = 'buildable';

  @property({ type: Vec2, tooltip: 'Смещение (0,0) клетки в локальных координатах worldLayer' })
  origin: Vec2 = new Vec2(0, -270);

  @property({ type: Boolean, tooltip: 'Поменять местами X и Y при чтении из Tiled' })
  swapXYForTiled = true;   // ← поставь true для твоего случая

  @property({ type: Boolean, tooltip: 'Отразить по X' })
  flipXForTiled = false;

  @property({ type: Boolean, tooltip: 'Отразить по Y' })
  flipYForTiled = true;    // если уже переворачивал по Y — оставь true

  @property({ type: Boolean, tooltip: 'Пустая ячейка (gid=0) = НЕстроибельно' })
  emptyIsNotBuildable = true;
  // дальше — рабочие поля (в инспектор можно не показывать)
  cols = 0;
  rows = 0;
  tileW = 0; // полная ширина ромба из Tiled
  tileH = 0;

  private _buildable: boolean[] = [];
  private _state: CELL_STATE[] = [];

  onLoad() {
    if (!this.tiled) { console.warn('[GridManager] TiledMap not set'); return; }

    const mapSize = this.tiled.getMapSize();
    const tileSize = this.tiled.getTileSize();
    this.cols = mapSize.width;
    this.rows = mapSize.height;
    this.tileW = tileSize.width;   // ВАЖНО: без деления
    this.tileH = tileSize.height;

    const total = this.cols * this.rows;
    this._buildable = new Array(total).fill(true);
    this._state = new Array(total).fill(CELL_STATE.FREE);

    this._readBuildableFromTiled();
  }

  // -------- helpers
  private idx(x: number, y: number) { return y * this.cols + x; }
  inBounds(x: number, y: number) { return x >= 0 && y >= 0 && x < this.cols && y < this.rows; }

  // -------- iso <-> world (локальные координаты worldLayer)
  gridToWorld(x: number, y: number): Vec3 {
    const hw = this.tileW * 0.5, hh = this.tileH * 0.5;
    const wx = this.origin.x + (x - y) * hw;
    const wy = this.origin.y + (x + y) * hh;
    return new Vec3(wx, wy, 0);
  }
  worldToGrid(wx: number, wy: number): Vec2 {
    const hw = this.tileW * 0.5, hh = this.tileH * 0.5;
    const lx = wx - this.origin.x;
    const ly = wy - this.origin.y;
    const gx = Math.round((ly / hh + lx / hw) * 0.5);
    const gy = Math.round((ly / hh - lx / hw) * 0.5);
    return new Vec2(gx, gy);
  }

  // -------- placement
  canPlace(x: number, y: number, w: number, h: number): boolean {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const cx = x + dx, cy = y + dy;
        if (!this.inBounds(cx, cy)) return false;
        const i = this.idx(cx, cy);
        if (!this._buildable[i]) return false;
        if (this._state[i] !== CELL_STATE.FREE) return false;
      }
    }
    return true;
  }
  occupy(x: number, y: number, w: number, h: number) {
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++)
        this._state[this.idx(x + dx, y + dy)] = CELL_STATE.OCCUPIED;
  }
  debris(x: number, y: number, w: number, h: number) {
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++)
        this._state[this.idx(x + dx, y + dy)] = CELL_STATE.DEBRIS;
  }
  clear(x: number, y: number, w: number, h: number) {
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++)
        this._state[this.idx(x + dx, y + dy)] = CELL_STATE.FREE;
  }

  // -------- accessors (для дебага/рендерера сетки)
  get buildableAt(): ReadonlyArray<boolean> { return this._buildable; }
  get stateAt(): ReadonlyArray<CELL_STATE> { return this._state; }

  // -------- import from Tiled
  private _readBuildableFromTiled(): void {
    const layer = this.tiled.getLayer(this.buildableLayerName) as unknown as TiledLayer;
    if (!layer) {
      console.warn(`[Grid] Layer "${this.buildableLayerName}" not found. All buildable = true.`);
      return;
    }

    const anyLayer: any = layer;
    const MASK_FLIP = 0x0fffffff; // снять флип-биты из GID

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        // GID тайла на слое (0 = пусто)
        const rawGid: number = (typeof anyLayer.getTileGIDAt === 'function')
          ? anyLayer.getTileGIDAt(x, y)
          : (((layer.getTiledTileAt(x, y, false) as any)?.gid) | 0);

        const gid = (rawGid | 0) & MASK_FLIP;

        // базовое правило: пустая клетка не строибельна (можно поменять флагом)
        let can = !(this.emptyIsNotBuildable && gid === 0);

        // если есть тайл — читаем его свойства из tileset
        if (gid !== 0) {
          const props = this.tiled.getPropertiesForGID(gid) as any;
          if (props && (this.buildablePropName in props)) {
            can = !!props[this.buildablePropName];
          }
        }

        // --- трансформации индексов, чтобы совпасть с геометрией карты ---
        let ix = this.swapXYForTiled ? y : x;
        let iy = this.swapXYForTiled ? x : y;

        if (this.flipXForTiled) ix = this.cols - 1 - ix;
        if (this.flipYForTiled) iy = this.rows - 1 - iy;

        this._buildable[this.idx(ix, iy)] = can;
      }
    }
  }
}
