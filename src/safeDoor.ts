import { Sprite } from '@pixi/sprite';
import { Container } from '@pixi/display';
import { SafeHandle } from './safeHandle';

export class SafeDoor extends Container {
    private doorSprite: Sprite;
    private handle: SafeHandle;

    get sprite() {
        return this.doorSprite;
    }

    constructor() {
        super();

        this.doorSprite = Sprite.from('images/door.png');
        this.doorSprite.anchor.set(0.5);
        this.doorSprite.x = 0;
        this.doorSprite.y = 0;
        this.addChild(this.doorSprite);

        this.handle = new SafeHandle();

        this.addChild(this.handle);
    }

    public setHandleOffset(x: number, y: number) {
        this.handle.position.set(x, y);
    }
}
