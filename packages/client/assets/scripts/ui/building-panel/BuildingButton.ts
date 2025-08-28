import { BUILDINGS, BUILDINGS_DATA } from 'db://assets/vendor/sim-core';
import { _decorator, Button, Color, Component, Enum, Label, Node, Sprite, SpriteAtlas } from 'cc';
import { BuildingPanel } from './BuildingPanel';
import { EventBus, EVT } from 'db://assets/game/core/EventBus';
const { ccclass, property } = _decorator;

Enum(BUILDINGS)
@ccclass('BuildingButton')
export class BuildingButton extends Component {
    @property(SpriteAtlas) iconAtlas: SpriteAtlas;
    @property(Sprite) bgSprite: Sprite;
    @property(Sprite) iconSprite: Sprite;
    @property({ type: BUILDINGS }) buildingId: BUILDINGS;
    @property(Label) priceLabel: Label;

    private btn!: Button;

    private refreshUI() {
        const spec = BUILDINGS_DATA[this.buildingId];
        const frame = this.iconAtlas.getSpriteFrame(`${this.buildingId}_ICON`);
        if (frame) this.iconSprite.spriteFrame = frame;
        this.priceLabel.string = String(spec.buildPrice);
    }

    start() {
        this.btn = this.getComponent(Button)!;
        this.disableBtn();
        this.refreshUI();
        this.listenEvents()
    }

    private onRes({ money }: { money: number }) {
        const price = BUILDINGS_DATA[this.buildingId].buildPrice;
        const affordable = money >= price;
        this.disableBtn(affordable);
    }

    listenEvents() {
        // подпишемся на ресурсы
        EventBus.on(EVT.RES_UPDATED, this.onRes, this);
    }

    stopListening() {
        EventBus.off(EVT.RES_UPDATED, this.onRes, this);
    }

    disableBtn(affordable = false) {
         this.btn.interactable = affordable;
        // легкий визуал
        this.iconSprite.grayscale = !affordable;
        this.priceLabel.color = affordable ? new Color(255, 255, 255, 255) : new Color(200, 80, 80, 255);
    }

    initBtn(id: BUILDINGS) { this.buildingId = id; this.refreshUI(); }

    onClick() {
        if (!this.btn.interactable) return;
        console.log('Выбрано здание', this.buildingId);
        EventBus.emit(EVT.BUILD_SELECT, { buildingId: this.buildingId });
    }

    protected onDisable(): void {
        this.stopListening();
    }
}


