import { Sprite } from '@pixi/sprite';
import { Container } from '@pixi/display';
import { SafeHandle } from './safeHandle';
import type { Config } from './configTypes';
import { Rectangle } from '@pixi/core';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class SafeDoor extends Container {
    private closedDoorSprite: Sprite;
    private openDoorSprite: Sprite;
    private handle: SafeHandle;

    get sprite() {
        return this.closedDoorSprite;
    }

    constructor(combination: number[], loadedConfig: Config) {
        super();

        this.closedDoorSprite = Sprite.from('images/door.png');
        this.closedDoorSprite.anchor.set(0.5);
        this.addChild(this.closedDoorSprite);
        //this.closedDoorSprite.visible = false;

        this.openDoorSprite = Sprite.from('images/doorOpen.png');
        this.openDoorSprite.anchor.set(0.5);
        this.addChild(this.openDoorSprite);
        this.setOpenDoorOffset(loadedConfig.safeOpenDoor.offsetX, loadedConfig.safeOpenDoor.offsetY);
        this.openDoorSprite.visible = false;

        this.setFixedBounds();
        
        this.handle = new SafeHandle(combination);
        this.addChild(this.handle);
        this.setHandleOffset(loadedConfig.safeHandle.offsetX, loadedConfig.safeHandle.offsetY);

        this.handle.on('openDoor', () => {
            this.animateOpen();
        });
    }

    private setFixedBounds(): void {
        const bounds = this.closedDoorSprite.getBounds();
     
        this.hitArea = new Rectangle(
            bounds.x, 
            bounds.y, 
            bounds.width, 
            bounds.height
        );
       
        this.getBounds = () => bounds.clone();
        this.getLocalBounds = () => bounds.clone();
    }

    private setOpenDoorOffset(x: number, y: number) {
        this.openDoorSprite.position.set(x, y);
    }

    private setHandleOffset(x: number, y: number) {
        this.handle.position.set(x, y);
    }

    private animateOpen(): void {
        this.closedDoorSprite.visible = false;
        this.handle.visible = false;
        this.openDoorSprite.visible = true;
        this.openDoorSprite.scale.x = 0;

        gsap.to(this.openDoorSprite, {
            pixi: { scaleX: 1},
            duration: 0.5,
            ease: "elastic.out(1, 0.5)"
        });   
    }
  
}
