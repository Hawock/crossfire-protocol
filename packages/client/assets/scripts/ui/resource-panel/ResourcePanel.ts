import { _decorator, Component, Label, director } from 'cc';
import { EventBus, EVT } from 'db://assets/game/core/EventBus';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('ResourcePanel')
@executeInEditMode(true)
export class ResourcePanel extends Component {
    @property(Label)
    moneyLabel: Label = null;

    @property(Label)
    energyLabel: Label = null;

    onLoad() {
        EventBus.on(EVT.RES_UPDATED, this.updateLabels, this);
    }

    private updateLabels(data: { money: number, energy: number }) {
        if (this.moneyLabel) this.moneyLabel.string = `${data.money}`;
        if (this.energyLabel) this.energyLabel.string = `${data.energy}`;
    }

    onDisable() {
        EventBus.off(EVT.RES_UPDATED, this.updateLabels, this);
    }
}
