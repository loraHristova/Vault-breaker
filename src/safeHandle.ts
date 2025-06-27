import { Container } from '@pixi/display';
import { Texture } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import { FederatedPointerEvent } from '@pixi/events'
import { getCurrentCode, resetCode } from './codeManager';
import gsap from 'gsap'

export class SafeHandle extends Container {
    private mainSprite: Sprite;
    private shadowSprite: Sprite;

    private currentRotation: number = 0;
    private isAnimating: boolean = false;
    private combination : number[];
    private userCombination = new Array<number>(3).fill(0);
    private hasRotatedYet : boolean = false;
    private wasLastLeft : boolean = false;
    private changeCount : number = 0;

    constructor(rightCombination: number[]) {
        super();

        this.combination = rightCombination;
       
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

    private resetHandle(): void {
        this.animateSpinsLikeGrazy(() => {
            this.userCombination.fill(0);
            resetCode();
            this.combination = getCurrentCode();

            this.hasRotatedYet = false;
            this.changeCount = 0;
            this.wasLastLeft = false;
            this.currentRotation = 0;
    });
    }

    private rotateRight(): void {
        if (this.wasLastLeft)
            this.changeCount++;

        if (!this.hasRotatedYet || (this.hasRotatedYet && this.changeCount == 0)) {
            this.userCombination[0]++;
            console.log(`userCombination[0] is: ${this.userCombination[0]}`);
            console.log(`combination[0] is: ${this.combination[0]}`);


            if (this.userCombination[0] > this.combination[0]){
                this.resetHandle();
                return;
            }
        } else if (this.hasRotatedYet && this.wasLastLeft && this.changeCount == 2) {
            this.userCombination[2]++;

            if (this.userCombination[2] > this.combination[2]){
                this.resetHandle();
                return;
            }
        } else if (this.changeCount >= 3) {
            this.resetHandle();
            return;
        }

        this.wasLastLeft = false;
        this.animateRotation(60);
    }

    private rotateLeft(): void {
        if (!this.wasLastLeft && this.changeCount == 0 && this.hasRotatedYet && this.userCombination[0] != this.combination[0]) {
            this.resetHandle();
            return;
        } else if(!this.wasLastLeft && this.changeCount == 0 && this.hasRotatedYet)
            this.changeCount++;
        else if ((this.changeCount != 1) || !this.hasRotatedYet) {
            this.resetHandle();
            return;
        }  

        this.combination[1]++;
        if (this.userCombination[1] > this.combination[1]){
                this.resetHandle();
                return;
        }

        this.wasLastLeft = true;
        this.animateRotation(-60);
    }

    private updateShadowPosition() {
    const baseOffsetX = 30;
    const baseOffsetY = 10;

    const angle = this.rotation;

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
            onUpdate: () => this.updateShadowPosition(),
            onComplete: () => {
                this.currentRotation = targetRotation;
                this.isAnimating = false;
                this.hasRotatedYet = true;
            }
        });
    }

    private animateSpinsLikeGrazy(onCompleteCallback?: () => void): void {
        this.isAnimating = true;

        const spins = 5;
        const totalDegrees = 360 * spins; 
        const totalRadians = totalDegrees * (Math.PI / 180);
        const targetRotation = this.currentRotation + totalRadians;

        const timeline = gsap.timeline({
            onComplete: () => {
                this.currentRotation = targetRotation;
                this.isAnimating = false;
                if (onCompleteCallback) onCompleteCallback();
            }
        });

        timeline.to(this, {
            rotation: targetRotation,
            duration: 3,
            ease: "power2.inOut", 
            onUpdate: () => this.updateShadowPosition(),
        });

        timeline.to(this, {
            rotation: 0,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
            onUpdate: () => this.updateShadowPosition(),
        });
    }
}