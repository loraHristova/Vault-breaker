import { Sprite } from "@pixi/sprite";
import { Texture } from "@pixi/core";

export class Blink extends Sprite {
    constructor(textureBlink: Texture) {
        super(textureBlink);
        this.anchor.set(0.5);
    }
}
