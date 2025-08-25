import { _decorator, Component, director } from 'cc';
const { ccclass } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager extends Component {
    private static _instance: ResourceManager;
    public static get instance() {
        return this._instance;
    }

    public money: number = 100;   // стартовое значение $
    public energy: number = 50;   // стартовое значение ⚡
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
    }

    private tickIncome() {
        this.money += this.incomeMoney;
        this.energy += this.incomeEnergy;
        this.notifyUpdate();
    }

    public spend(m: number, e: number): boolean {
        if (this.money >= m && this.energy >= e) {
            this.money -= m;
            this.energy -= e;
            this.notifyUpdate();
            return true;
        }
        return false;
    }

    private notifyUpdate() {
        director.emit('resources-updated', { 
            money: this.money, 
            energy: this.energy 
        });
    }
}
