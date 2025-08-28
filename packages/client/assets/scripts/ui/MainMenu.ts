import { i18n } from 'db://assets/vendor/sim-core';
import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {
    protected onLoad(): void {
        i18n.initI18n('ru').then(() => {
            // дай знать UI, что переводы готовы
            this.node.emit('i18n:ready');
        });
    }
    private onStart() {
        // грузим сцену боя
        director.loadScene('Battleground');
    }

    private onSettings() {
        console.log('Открыть настройки (пока заглушка)');
        // позже можно открыть отдельное окно / сцену
    }

    private onExit() {
        console.log('Выход из игры (работает только в Native)');
        if (window && (window as any).jsb) {
            (window as any).jsb.Device.finishTasks(); // пример для Cocos Native
        }
    }
}


