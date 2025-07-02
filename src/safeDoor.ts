import { Sprite } from '@pixi/sprite';
import { Container } from '@pixi/display';
import { SafeHandle } from './safeHandle';
import type { Config } from './configTypes';
import { Rectangle, Texture } from '@pixi/core';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { customWait } from './utils';
import { Blink } from './Blink';
import { MAX_BLINKS, BLINKS_OFFSET } from './constants';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class SafeDoor extends Container {
    private closedDoorSprite: Sprite;
    private openDoorSprite: Sprite;
    private handle: SafeHandle;

    private isBlinkingActive: boolean = false;
    private blinkSprites: Blink[] = [];

    get sprite() {
        return this.closedDoorSprite;
    }

    constructor(combination: [number, string][], loadedConfig: Config) {
        super();

        this.closedDoorSprite = Sprite.from('images/door.png');
        this.closedDoorSprite.anchor.set(0.5);
        this.addChild(this.closedDoorSprite);

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

        this.handle.on('timerReset', () => {
            this.emit('timerReset');
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

    private async startBlinking() {
        this.isBlinkingActive = true;

        const createBlinkSprite = () => {
            if (this.blinkSprites.length >= MAX_BLINKS) return;
            const texture = Texture.from('images/blink.png');

            const blinkSprite = new Blink(texture);
            blinkSprite.alpha = 1;
            blinkSprite.anchor.set(0.5);
            blinkSprite.scale.set(0);
            this.addChild(blinkSprite);
            this.blinkSprites.push(blinkSprite);

            if (this.blinkSprites.length > MAX_BLINKS) {
                const oldSprite = this.blinkSprites.shift();
                if (oldSprite) {
                    this.removeChild(oldSprite);
                    oldSprite.destroy();
                }
            }

            const doorCenterX = this.closedDoorSprite.x - BLINKS_OFFSET;
            const doorCenterY = this.closedDoorSprite.y + BLINKS_OFFSET;
            const radius = Math.min(this.closedDoorSprite.width, this.closedDoorSprite.height) / 2;
            const maxBlinkRadius = radius / 2;

            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * maxBlinkRadius;
            const offsetX = Math.cos(angle) * r;
            const offsetY = Math.sin(angle) * r;
            blinkSprite.position.set(doorCenterX + offsetX, doorCenterY + offsetY);

            gsap.to(blinkSprite.scale, {
                x: 1,
                y: 1,
                duration: 0.4,
                ease: "back.out(1.7)"
            });

            gsap.to(blinkSprite, {
                alpha: 0,
                duration: 1,
                delay: 0.6,
                ease: "power1.inOut",
                onComplete: () => {
                    if (this.children.includes(blinkSprite)) {
                        this.removeChild(blinkSprite);
                        blinkSprite.destroy();
                    }
                    const index = this.blinkSprites.indexOf(blinkSprite);
                    if (index !== -1) this.blinkSprites.splice(index, 1);
                }
            });
        };

        const spawnLoop = async () => {
            while(this.isBlinkingActive) {
                createBlinkSprite();
                await customWait(300);
            }
        };

        await spawnLoop();
    }

    private stopBlinking(): void {
        this.isBlinkingActive = false;
   
        this.blinkSprites.forEach(sprite => {
            if (this.children.includes(sprite)) {
                this.removeChild(sprite);
                sprite.destroy();
            }
        });

        this.blinkSprites = [];
    }

    private async animateOpen() {
        this.closedDoorSprite.visible = false;
        this.handle.visible = false;
        this.openDoorSprite.visible = true;
        this.openDoorSprite.scale.x = 0;

        gsap.to(this.openDoorSprite, {
            pixi: { scaleX: 1},
            duration: 0.7,
            ease: "elastic.out(1, 0.5)"
        }); 
        
        this.startBlinking();
        await customWait(5000);
        this.animateClose();
    }

    private animateClose(): void {
        gsap.to(this.openDoorSprite, {
            pixi: { scaleX: 0},
            duration: 0.5,
            ease: "elastic.in(1, 0.5)",
            onComplete: () => {
                this.stopBlinking();
                this.closedDoorSprite.visible = true;
                this.openDoorSprite.visible = false;
                this.handle.visible = true; 
                this.handle.reset();
            }
        }); 
    }    
}

