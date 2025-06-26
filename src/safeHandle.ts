import { Container } from '@pixi/display';
import { Texture } from '@pixi/core';
import { Sprite } from '@pixi/sprite';

export class SafeHandle extends Container {
    private mainSprite: Sprite;
    private shadowSprite: Sprite;

    constructor() {
        super();

        this.mainSprite = new Sprite(Texture.from('images/handle.png'));
        this.mainSprite.anchor.set(0.5, 0.5);

        this.shadowSprite = new Sprite(Texture.from('images/handleShadow.png'));
        this.shadowSprite.anchor.set(0.5, 0.5);
        this.shadowSprite.x = 20;
        this.shadowSprite.y = 20;

        this.addChild(this.shadowSprite);
        this.addChild(this.mainSprite);
    }
}