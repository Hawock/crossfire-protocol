import { _decorator, Component, Node } from 'cc';
import { i18n } from 'sim-core';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    onLoad() {
    i18n.initI18n('ru').then(() => {
      // дай знать UI, что переводы готовы
      this.node.emit('i18n:ready');
    });
  }
    start() {

    }

    update(deltaTime: number) {
        
    }
}


