import { Application } from '@pixi/app';
import { Sprite } from '@pixi/sprite';
import { loadTextures } from './assets';
import { SafeDoor } from './safeDoor';
import { loadConfig } from './configLoader';
import { extensions, ExtensionType, Texture } from '@pixi/core';
import { EventSystem } from '@pixi/events';
import { Text } from '@pixi/text';
import { generateCode } from './codeManager';
import { getSeconds, resetTimer, setTimer } from './timer'
import { ORIGINAL_BG_HEIGHT, ORIGINAL_BG_WIDTH, KEYPAD_OFFSET_X, KEYPAD_OFFSET_Y } from './constants';

extensions.add({
    name: 'EventSystem',
    type: ExtensionType.RendererPlugin,
    ref: EventSystem,
});

export class SafeApp {
    private app: Application;
    private background!: Sprite;
    private door!: SafeDoor;
    private code!: [number, string][];
    private config: any;

    private originalDoorWidth?: number;

    private counterText: Text;

    private bgTexture!: Texture;

    private lastScreenX: number;
    private lastScreenY: number;

    constructor() {
        this.app = new Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x5f8573
        });

        this.app.stage.eventMode = 'static';

        const canvas = this.app.view as HTMLCanvasElement;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';  
        canvas.style.height = '100vh';  
        canvas.style.display = 'block';
        document.body.appendChild(canvas);

        this.counterText = new Text('0', {
            fontFamily: 'Orbitron, Arial, sans-serif',
            fontWeight: '700',
            fontSize: Math.floor(window.innerWidth * 0.01),
            fill: 0xff0000
        });

        this.lastScreenX = window.screenX;
        this.lastScreenY = window.screenY;

        this.handleResize = this.handleResize.bind(this);
        this.checkScreenMove = this.checkScreenMove.bind(this);
        this.updateTimer = this.updateTimer.bind(this);
        this.resizeTimer = this.resizeTimer.bind(this);
        this.start = this.start.bind(this);
    }

    public async init() {
        await loadTextures();
        this.config = await loadConfig();
        this.bgTexture = Texture.from('images/bg.png');
        this.background = new Sprite(this.bgTexture);

        this.code = generateCode();
        this.door = new SafeDoor(this.code, this.config);

        window.addEventListener('resize', this.handleResize);
        window.matchMedia('screen').addEventListener('change', this.handleResize);

        this.door.on('timerReset', resetTimer);

        setInterval(this.updateTimer, 1000);

        setInterval(this.checkScreenMove, 1000);

        this.start();
    }

    private updateTimer() {
        setTimer(getSeconds() + 1);
        this.updateCounter(getSeconds());
    }

    private updateCounter(value: number) {
        const minutes = Math.floor(value / 60);
        const seconds = value % 60;
        const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        this.counterText.text = timeString;
    }

    private resizeTimer(): void {
        const keypadXRatio = KEYPAD_OFFSET_X / ORIGINAL_BG_WIDTH;
        const keypadYRatio = KEYPAD_OFFSET_Y / ORIGINAL_BG_HEIGHT;

        const scaleX = this.background.width / ORIGINAL_BG_WIDTH;
        const scaleY = this.background.height / ORIGINAL_BG_HEIGHT;
        const scale = Math.max(scaleX, scaleY);

        const scaledWidth = ORIGINAL_BG_WIDTH * scale;
        const scaledHeight = ORIGINAL_BG_HEIGHT * scale;

        const bgX = this.background.x;
        const bgY = this.background.y;

        const keypadRealX = bgX + scaledWidth * keypadXRatio;
        const keypadRealY = bgY + scaledHeight * keypadYRatio;

        this.counterText.position.set(keypadRealX, keypadRealY);
        this.counterText.style.fontSize = Math.floor(window.innerWidth * 0.01);
    }

    private handleResize() {
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        this.resizeAll();
    }

    private checkScreenMove() {
        if (window.screenX !== this.lastScreenX || window.screenY !== this.lastScreenY) {
            this.lastScreenX = window.screenX;
            this.lastScreenY = window.screenY;
            this.handleResize();
        }
    }

    private resizeBackground() {
        const scaleX = this.app.screen.width / this.bgTexture.width;
        const scaleY = this.app.screen.height / this.bgTexture.height;
        const scale = Math.min(scaleX, scaleY);

        this.background.scale.set(scale);
        this.background.x = (this.app.screen.width - this.background.width) / 2;
        this.background.y = (this.app.screen.height - this.background.height) / 2;
    }

    private resizeDoor() {
        if (this.originalDoorWidth === undefined) 
            this.originalDoorWidth = this.door.width;
        
        const desiredWidth = this.app.screen.width * this.config.safeClosedDoor.scaleRatio;
        const scaleRatio = desiredWidth / this.originalDoorWidth;

        this.door.scale.set(scaleRatio);
        this.door.x = this.app.screen.width / 2 + this.config.safeClosedDoor.offsetX;
        this.door.y = this.app.screen.height / 2 + this.config.safeClosedDoor.offsetY;
    }

    private resizeAll() {
        this.resizeBackground();
        this.resizeTimer();
        this.resizeDoor();
    }

    private start() {
        this.resizeBackground();
        this.app.stage.addChild(this.background);

        this.resizeTimer();
        this.app.stage.addChild(this.counterText);

        this.resizeDoor();
        this.app.stage.addChild(this.door);
    }
}

