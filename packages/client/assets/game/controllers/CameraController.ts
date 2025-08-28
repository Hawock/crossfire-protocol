// CameraController.ts — Cocos Creator 3.x
// Панорамирование WASD без зума. Границы считаются из mapNode.
// Формула: delta = (mapSize - viewSize) / 2, центр = центр AABB карты.

import {
  _decorator, Component, input, Input, EventKeyboard,
  KeyCode, Vec3, view, Camera, Node, UITransform
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
  @property(Camera)
  camera!: Camera;          // Камера мира (Orthographic)

  @property(Node)
  mapNode!: Node;           // Корневой узел карты (охватывает всю карту)

  @property
  moveSpeed: number = 1200;

  @property
  padding: number = 0;

  @property
  horizontalBoost: number = 2; // скорость по горизонтали в 2 раза быстрее

  @property
  verticalBoost: number = 1;   // скорость по вертикали без изменений

  // Если вдруг захочешь, можно включить компенсацию диагонали:
  @property
  compensateDiagonal: boolean = false;

  // Центр карты и допустимые отклонения центра камеры по осям
  private _cx = 0; private _cy = 0;
  private _dx = 0; private _dy = 0;

  private _keys = new Set<KeyCode>();

  onEnable() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

    view.on('canvas-resize', this.recalcBounds, this);
    view.on('design-resolution-changed', this.recalcBounds, this);
  }

  onDisable() {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.off(Input.EventType.KEY_UP, this.onKeyUp, this);

    view.off('canvas-resize', this.recalcBounds, this);
    view.off('design-resolution-changed', this.recalcBounds, this);
  }

  start() {
    if (!this.camera) this.camera = this.getComponent(Camera)!;
    // Даем кадр, чтобы карта инициализировалась
    this.scheduleOnce(() => {
      this.recalcBounds();
      this.setClamped(this.node.position);
    }, 0);
  }

  // Пересчёт границ по формуле delta = (map - view) / 2
  public recalcBounds = () => {
    if (!this.mapNode) return;

    // 1) AABB карты в мире
    const mapUI = this.mapNode.getComponent(UITransform);
    const rectW = mapUI?.getBoundingBoxToWorld();
    if (!rectW) return;

    // 2) В локальные координаты родителя камеры
    const parentUI = this.node.parent?.getComponent(UITransform);
    const toLocal = (x: number, y: number) =>
      parentUI ? parentUI.convertToNodeSpaceAR(new Vec3(x, y, 0)) : new Vec3(x, y, 0);

    const bl = toLocal(rectW.xMin, rectW.yMin); // bottom-left
    const tr = toLocal(rectW.xMax, rectW.yMax); // top-right

    const mapW = tr.x - bl.x;
    const mapH = tr.y - bl.y;

    // Центр карты
    this._cx = (bl.x + tr.x) * 0.5;
    this._cy = (bl.y + tr.y) * 0.5;

    // 3) Размер видимой области ортокамеры
    const canvas = view.getCanvasSize();
    const aspect = canvas.width / canvas.height;
    const viewW = this.camera.orthoHeight * 2 * aspect;
    const viewH = this.camera.orthoHeight * 2;

    // 4) Delta (не отрицательная) + padding
    this._dx = Math.max(0, (mapW - viewW) * 0.5 - this.padding);
    this._dy = Math.max(0, (mapH - viewH) * 0.5 - this.padding);
  }

  update(dt: number) {
    let ix = 0, iy = 0;
    if (this._keys.has(KeyCode.KEY_W) || this._keys.has(KeyCode.ARROW_UP))    iy += 1;
    if (this._keys.has(KeyCode.KEY_S) || this._keys.has(KeyCode.ARROW_DOWN))  iy -= 1;
    if (this._keys.has(KeyCode.KEY_A) || this._keys.has(KeyCode.ARROW_LEFT))  ix -= 1;
    if (this._keys.has(KeyCode.KEY_D) || this._keys.has(KeyCode.ARROW_RIGHT)) ix += 1;

    if (!ix && !iy) return;

    // Анизотропная скорость
    let vx = ix * this.moveSpeed * this.horizontalBoost;
    let vy = iy * this.moveSpeed * this.verticalBoost;

    // Опционально: нормализовать диагональ, чтобы по диагонали не было «слишком быстро»
    if (this.compensateDiagonal && (ix && iy)) {
      const k = Math.SQRT1_2 / Math.hypot(this.horizontalBoost, this.verticalBoost);
      vx *= k * Math.SQRT2;  // эквивалентно делению на sqrt(h^2 + v^2) и умножению на sqrt(2)
      vy *= k * Math.SQRT2;
    }

    const next = this.node.position.clone();
    next.x += vx * dt;
    next.y += vy * dt;

    this.setClamped(next);
  }

  private setClamped(p: Vec3) {
    // Ограничиваем центр камеры прямоугольником:
    // [cx - dx, cx + dx] × [cy - dy, cy + dy]
    const minX = this._cx - this._dx;
    const maxX = this._cx + this._dx;
    const minY = this._cy - this._dy;
    const maxY = this._cy + this._dy;

    const x = Math.min(Math.max(p.x, minX), maxX);
    const y = Math.min(Math.max(p.y, minY), maxY);

    this.node.setPosition(x, y, p.z);
  }

  private onKeyDown(e: EventKeyboard) { this._keys.add(e.keyCode); }
  private onKeyUp(e: EventKeyboard) { this._keys.delete(e.keyCode); }
}
