import { Sprite } from '@pixi/sprite';
import { Assets } from '@pixi/assets';
import { Container } from '@pixi/display';

export class SafeDoor extends Container {
    private doorSprite: Sprite;

    get sprite() {
        return this.doorSprite;
    }

    constructor() {
        super();

        this.doorSprite = Sprite.from('images/door.png');
        this.doorSprite.anchor.set(0.5);
        this.addChild(this.doorSprite);

        this.doorSprite.x = 0;
        this.doorSprite.y = 0;
    }
}
