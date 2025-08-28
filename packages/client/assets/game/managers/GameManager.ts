import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    onLoad() {
      console.log("GameManager onLoad");
  }
    start() {

    }

    update(deltaTime: number) {
        
    }
}


