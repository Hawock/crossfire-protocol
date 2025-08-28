import { RESOURCES } from 'db://assets/config/resource.enum';
import { _decorator, CCString, Component, Enum, Label, Node, Sprite, SpriteAtlas } from 'cc';
const { ccclass, property } = _decorator;

Enum(RESOURCES)
@ccclass('ResourceItem')
export class ResourceItem extends Component {
    @property(Sprite) spriteFrame: Sprite
    @property(Label) label: Label
    @property({type: RESOURCES}) icon: RESOURCES = RESOURCES.MINERALS
    @property(SpriteAtlas) atlas: SpriteAtlas
    

    start() {
        this.init();
    }

    init() {
        this.spriteFrame.spriteFrame = this.atlas.getSpriteFrame(this.icon);
    }

    update(deltaTime: number) {
        
    }
}


