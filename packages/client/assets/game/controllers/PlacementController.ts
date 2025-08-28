// db://assets/game/build/PlacementController.ts
import { _decorator, Component, Node, EventMouse, UITransform, Vec3, Color, input, Input, EventKeyboard, KeyCode, instantiate, Sprite, Prefab, Camera } from 'cc';
import { EventBus, EVT } from 'db://assets/game/core/EventBus';
import { GridManager } from 'db://assets/game/grid/GridManager';
import { GhostBuilding } from 'db://assets/scripts/buildings/GhostBuilding';
import { BUILDINGS, BUILDINGS_DATA } from 'db://assets/vendor/sim-core';


const { ccclass, property } = _decorator;

@ccclass('PlacementController')
export class PlacementController extends Component {
  @property(Camera) worldCamera!: Camera;
  @property({type: GridManager, tooltip: 'GridManager'}) grid!: GridManager;
  @property(Node) worldLayer!: Node;
  @property(Prefab) ghostPrefab!: Prefab;
  @property(Node) inputSurface!: Node;

  private currentId: BUILDINGS | null = null;
  private ghost: Node | null = null;
  private sizeW = 1; private sizeH = 1;

    start() {
        console.log("КУСЬ!");
    }

  onLoad() {
    EventBus.on(EVT.BUILD_SELECT, this.onBuildSelect, this);
    this.inputSurface.on(Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
    this.inputSurface.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
  }
  onDisable() {
    EventBus.off(EVT.BUILD_SELECT, this.onBuildSelect, this);
    this.inputSurface.off(Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
    this.inputSurface.off(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  private onBuildSelect(event: {buildingId: BUILDINGS}) {
    this.startPlacing(event.buildingId);
  }

  private startPlacing(id: BUILDINGS) {
    this.currentId = id;
    const spec = BUILDINGS_DATA[id];
    console.log(spec)
    this.sizeW = spec.size.w; this.sizeH = spec.size.h;

    // создать призрак
    this.ghost?.destroy();
    this.ghost = instantiate(this.ghostPrefab);
    // установить какой призрак рисовать (по id)
    const gb = this.ghost.getComponent(GhostBuilding);
    if (gb) gb.buildingID = id;

    // базовый полупрозрачный цвет (потом будем красить зел/крас)
    const spr = this.ghost.getComponent(Sprite);
    if (spr) spr.color = new Color(140,175,255,160);

    this.worldLayer.addChild(this.ghost);
  }

  private onKeyDown(e: EventKeyboard) {
    if (e.keyCode === KeyCode.ESCAPE) this.cancel();
  }
  private cancel() {
    this.currentId = null;
    this.ghost?.destroy(); this.ghost = null;
  }

  private screenToLocal(x:number,y:number) {
    const ui = this.inputSurface.getComponent(UITransform)!;
    return ui.convertToNodeSpaceAR(new Vec3(x, y, 0));
  }

    private onMouseMove(e: EventMouse) {
      if (!this.currentId || !this.ghost) return;

      const p = e.getUILocation(); // экранные UI-координаты (px)
      // 1) экран -> МИР с учётом worldCamera
      const world = this.worldCamera.screenToWorld(new Vec3(p.x, p.y, 0));
      // 2) МИР -> локаль worldLayer (узел, где живёт грид/гост)
      const ui = this.worldLayer.getComponent(UITransform)!;
      const local = ui.convertToNodeSpaceAR(world);

      const g   = this.grid.worldToGrid(local.x, local.y);
      const pos = this.grid.gridToWorld(g.x, g.y);
      this.ghost.setPosition(pos);

      const ok  = this.grid.canPlace(g.x, g.y, this.sizeW, this.sizeH);
      const spr = this.ghost.getComponentInChildren(Sprite);
      if (spr) spr.color = ok ? new Color(0,255,0,160) : new Color(255,0,0,160);
    }

  private onMouseDown(e: EventMouse) {
    if (!this.currentId || !this.ghost) return;
    if (e.getButton() === EventMouse.BUTTON_RIGHT) { this.cancel(); return; }
    // на этом шаге мы только проверяем визуально — постановку/ресурсы подключим следующим шагом
  }
}
