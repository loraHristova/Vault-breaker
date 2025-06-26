import { Sprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';

export class SafeHandle extends Sprite {
    constructor() {
        super(Texture.from('images/handle.png'));

        this.anchor.set(0.5, 0.5);
    }
}