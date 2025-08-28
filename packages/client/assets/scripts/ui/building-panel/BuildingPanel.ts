import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { BUILDINGS } from 'db://assets/vendor/sim-core';
import { EventBus, EVT } from 'db://assets/game/core/EventBus';
import { BuildingButton } from './BuildingButton';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('BuildingPanel')
@executeInEditMode(true)
export class BuildingPanel extends Component {
    @property(Prefab) buildingBtnPrefab: Prefab


    start() {
        this.initButtons();
    }

    initButtons() {
        this.node.removeAllChildren();
        //TODO: потом здесь сделать условие для состяния PRE_GAME и GAME
        if(true) {
            for(let buildingId in BUILDINGS) {
                if(buildingId === BUILDINGS.HQ) continue;
                const btn = this.createButton(buildingId as BUILDINGS);
                this.node.addChild(btn);
            }
        }
    }

    createButton(buildingID: BUILDINGS) {
        const btn = instantiate(this.buildingBtnPrefab);
        btn.getComponent<BuildingButton>("BuildingButton").initBtn(buildingID);
        return btn;
    }

}


