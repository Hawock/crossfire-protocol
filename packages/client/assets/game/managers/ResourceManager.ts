import { _decorator, Component, director } from 'cc';
import { GAME_CONFIG } from 'db://assets/config/game.cfg';
import { EventBus, EVT } from 'db://assets/game/core/EventBus';
const { ccclass } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager extends Component {
    private static _instance: ResourceManager;
    public static get instance() {
        return this._instance;
    }

    public money: number = GAME_CONFIG.startMoney  // стартовое значение $
    public energy: number = GAME_CONFIG.starEnergy;   // стартовое значение ⚡
    private incomeMoney: number = 2; // +2 $/сек
    private incomeEnergy: number = 2; // +2 ⚡/сек

    onLoad() {
        if (ResourceManager._instance) {
            this.destroy();
            return;
        }
        ResourceManager._instance = this;
    }

    start() {
        this.schedule(this.tickIncome, 1); // тик каждую секунду
        this.emitUpdate();
    }

    private tickIncome() {
        this.money += this.incomeMoney;
        this.energy += this.incomeEnergy;
        this.emitUpdate();
    }

    public spend(m: number, e: number): boolean {
        if (this.money >= m && this.energy >= e) {
            this.money -= m;
            this.energy -= e;
            this.emitUpdate();
            return true;
        }
        return false;
    }

    private emitUpdate() {
        EventBus.emit(EVT.RES_UPDATED, { money: this.money, energy: this.energy });
    }
}
