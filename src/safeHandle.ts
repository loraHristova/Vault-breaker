import { Container } from '@pixi/display';
import { Texture } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import { FederatedPointerEvent } from '@pixi/events'
import gsap from 'gsap'

export class SafeHandle extends Container {
    private mainSprite: Sprite;
    private shadowSprite: Sprite;
    private currentRotation: number = 0;
    private isAnimating: boolean = false;

    constructor() {
        super();

        this.mainSprite = new Sprite(Texture.from('images/handle.png'));
        this.mainSprite.anchor.set(0.5, 0.5);

        this.shadowSprite = new Sprite(Texture.from('images/handleShadow.png'));
        this.shadowSprite.anchor.set(0.5, 0.5);
        
        this.shadowSprite.x = 30;
        this.shadowSprite.y = 10;

        this.addChild(this.shadowSprite);
        this.addChild(this.mainSprite);
        
        this.setupInteractivity();
    }

    private setupInteractivity(): void {
        this.eventMode = 'static';
        this.cursor = 'pointer';
     
        this.on('pointerdown', this.onHandleClick.bind(this));
    }

    private onHandleClick(event: FederatedPointerEvent): void {
        if(this.isAnimating) return;

        const globalPoint = event.global;

        const isRightSide = globalPoint.x > this.mainSprite.toGlobal({x: 0, y: 0}).x;

        if (isRightSide) {
            this.rotateRight();
        } else {
            this.rotateLeft();
        }
    }

    private rotateRight(): void {
        this.animateRotation(60);
    }

    private rotateLeft(): void {
        this.animateRotation(-60);
    }

    private updateShadowPosition(degrees: number) {
    const baseOffsetX = degrees > 0 ? 30 : -30;
    const baseOffsetY = 10;

    const angle = this.currentRotation;

    const cos = Math.cos(-angle);
    const sin = Math.sin(-angle);


    /* To recalculate the new coordinates:
        x′ = x⋅cos(θ)−y⋅sin(θ)
        y′ = x⋅sin(θ)+y⋅cos(θ)
    */
    const rotatedX = baseOffsetX * cos - baseOffsetY * sin; 
    const rotatedY = baseOffsetX * sin + baseOffsetY * cos;

    this.shadowSprite.x = rotatedX;
    this.shadowSprite.y = rotatedY;
}


    private animateRotation(degrees: number): void {
        this.isAnimating = true;

        const radians = degrees * (Math.PI / 180);
        const targetRotation = this.currentRotation + radians;

        gsap.to(this, {
            rotation: targetRotation,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => this.updateShadowPosition(degrees),
            onComplete: () => {
                this.currentRotation = targetRotation;
                this.isAnimating = false;
            }
        });
    }

}