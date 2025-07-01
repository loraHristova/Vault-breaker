import { Container } from '@pixi/display';
import { Texture } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import { FederatedPointerEvent } from '@pixi/events'
import { getCurrentCode, resetCode } from './codeManager';
import { resetTimer } from './timer'
import { eventBus } from './eventBus';
import gsap from 'gsap'

export class SafeHandle extends Container {
    private mainSprite: Sprite;
    private shadowSprite: Sprite;

    private combination : [number, string][];
    private userCombination = new Array<number>(3).fill(0);
    private wasLastLeft : boolean = false;
    private wasLastRight : boolean = false;
    private changeCount : number = 0;

    constructor(rightCombination: [number, string][]) {
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
        const globalPoint = event.global;

        const isRightSide = globalPoint.x > this.mainSprite.toGlobal({x: 0, y: 0}).x;

        if (isRightSide) 
            this.changeCount = this.rotate("right", this.changeCount);
        else 
            this.changeCount = this.rotate("left", this.changeCount);
        
    }

    private resetHandle(): void {
        this.animateSpinsLikeGrazy(() => {
            this.userCombination.fill(0);
            resetCode();
            this.combination = getCurrentCode();
            this.changeCount = 0;
            this.wasLastLeft = false;
            this.wasLastRight = false;

            resetTimer();
            eventBus.emit('timerReset');
    });
    }
    
    public reset(): void {
        this.resetHandle();
    }

    private rotate(direction: string, changeCount: number): number {
        if (direction === "right") {
            if (this.wasLastLeft)
                changeCount++;

            if (this.combination[changeCount][1] !== "clockwise"){
                this.resetHandle();
                return 0;
            } else {
                this.animateRotation(60);

                this.wasLastLeft = false;
                this.wasLastRight = true;
            }
        } else if (direction === "left") {
            if (this.wasLastRight)
                changeCount++;

            if (this.combination[changeCount][1] !== "counterclockwise"){
                this.resetHandle();
                return 0;
            } else {
                this.animateRotation(-60);

                this.wasLastLeft = true;
                this.wasLastRight = false;
            }
        } 

        console.log(`in rotate function, rotating: ${direction} with change Count: ${changeCount}`);
        this.userCombination[changeCount]++;
        console.log(`right now userCombination is: ${this.userCombination[changeCount]}`);

        console.log(`right now combination is: ${this.combination[changeCount]}`);

        //changing directions, check if last rotations were less than expected
        if (changeCount != 0 && this.userCombination[changeCount - 1] !== this.combination[changeCount - 1][0]) {
            this.resetHandle();
            return 0;

        //check if we rotated more times than expected
        } else if (this.userCombination[changeCount] > this.combination[changeCount][0]){
            this.resetHandle();
            return 0;

        //if we have something like that: 1 clockwise, 2 clockwise, 6 counterclockwise we want to move to the next cell
        } else if (changeCount < 2 && 
                   this.userCombination[changeCount] === this.combination[changeCount][0] && 
                   this.combination[changeCount + 1][1] === this.combination[changeCount][1]) {
            changeCount++;
        } else if (changeCount == 2 && this.userCombination[changeCount] === this.combination[changeCount][0]) {
            this.emit("openDoor");
        }

        return changeCount;
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
        const radians = degrees * (Math.PI / 180);
        const targetRotation = this.rotation + radians;

        gsap.to(this, {
            rotation: targetRotation,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => this.updateShadowPosition(),
        });
    }

    private animateSpinsLikeGrazy(onCompleteCallback?: () => void): void {
        const spins = 5;
        const totalDegrees = 360 * spins; 
        const totalRadians = totalDegrees * (Math.PI / 180);
        const targetRotation = this.rotation + totalRadians;

        const timeline = gsap.timeline({
            onComplete: () => {
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