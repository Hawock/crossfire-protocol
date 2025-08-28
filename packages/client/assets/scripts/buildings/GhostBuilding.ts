import { _decorator, Component, Enum, Sprite, SpriteAtlas, UITransform, Color } from 'cc';
import { BUILDINGS } from '../../vendor/sim-core';
import { BUILDINGS_DATA } from '../../vendor/sim-core'; // где лежит твой BUILDINGS_DATA
const { ccclass, property, executeInEditMode } = _decorator;

Enum(BUILDINGS);

@ccclass('GhostBuilding')
@executeInEditMode(true)
export class GhostBuilding extends Component {
  @property({ type: BUILDINGS })
  get buildingID(): BUILDINGS { return this._buildingID; }
  set buildingID(v: BUILDINGS) {
    if (this._buildingID === v) return;
    this._buildingID = v;
    this.applyOnce();
  }
  private _buildingID: BUILDINGS = BUILDINGS.HQ;

  @property(SpriteAtlas)
  buildingAtlas: SpriteAtlas = null!;

  @property(Sprite)
  buildingSprite: Sprite = null!;

  @property(UITransform)
  uiTransform: UITransform = null!;

  // размеры тайла в пикселях (подгони под свой TiledMap)
  @property
  tileWidth = 64;

  @property
  tileHeight = 64;

  private _lastBuildingID: BUILDINGS | null = null;
  private _lastAtlas: SpriteAtlas | null = null;

  onEnable() {
    this.applyOnce();
  }

  onValidate() {
    // В редакторе реагируем на смену пропертей
    this.applyOnce();
  }

  // вызывать только когда поменялся buildingID или атлас
  private applyOnce() {
    if (!this.buildingAtlas || !this.buildingSprite || !this.uiTransform) return;

    if (this._lastBuildingID === this.buildingID && this._lastAtlas === this.buildingAtlas) {
      return;
    }
    this._lastBuildingID = this.buildingID;
    this._lastAtlas = this.buildingAtlas;

    // Если фреймы названы как имена enum:
    // const frameName = BUILDINGS[this.buildingID]; // "MISSILE_LAUNCHER"
    // Если фреймы названы цифрами — оставь как у тебя:
    const frameName = `${this.buildingID}`;


    const frame = this.buildingAtlas.getSpriteFrame(frameName);
    if (frame) {
      this.buildingSprite.spriteFrame = frame;
    }

    // Размер из BUILDINGS_DATA (1×1 или 3×3)
    const spec = BUILDINGS_DATA[this.buildingID];
    const wCells = spec?.size?.w ?? 1;
    const hCells = spec?.size?.h ?? 1;

    // Приведём размер UITransform под гридовые тайлы
    this.uiTransform.setContentSize(wCells * this.tileWidth, hCells * this.tileHeight);
  }
}
