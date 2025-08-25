import { _decorator, Component, Label, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResourcePanel')
export class ResourcePanel extends Component {
    @property(Label)
    moneyLabel: Label = null;

    @property(Label)
    energyLabel: Label = null;

    onLoad() {
        director.on('resources-updated', this.updateLabels, this);
    }

    start() {
        // сразу показать стартовые значения
        this.updateLabels({
            money: 100,
            energy: 50
        });
    }

    private updateLabels(data: { money: number, energy: number }) {
        if (this.moneyLabel) this.moneyLabel.string = `${data.money}`;
        if (this.energyLabel) this.energyLabel.string = `${data.energy}`;
    }

    onDestroy() {
        director.off('resources-updated', this.updateLabels, this);
    }
}
