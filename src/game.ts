import { Application } from '@pixi/app';
import { Sprite } from '@pixi/sprite';
import { loadTextures } from './assets';
import { SafeDoor } from './safeDoor';
import { loadConfig } from './configLoader';
import { extensions, ExtensionType, Texture } from '@pixi/core';
import { EventSystem } from '@pixi/events';
import { Text } from '@pixi/text';
import { generateCode } from './codeManager';
import { getSeconds, setTimer } from './timer'
import { eventBus } from './eventBus';

let background: Sprite;
let originalDoorWidth: number;
let originalDoorHeight: number;

extensions.add({
    name: 'EventSystem',
    type: ExtensionType.RendererPlugin,
    ref: EventSystem,
});

const app = new Application({
    backgroundAlpha: 0,
    width: window.innerWidth,
    height: window.innerHeight,
});

app.stage.eventMode = 'static';

const canvas = app.view as HTMLCanvasElement;
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';  
canvas.style.height = '100vh';  
canvas.style.display = 'block';
document.body.appendChild(canvas);

const counterText = new Text('0', {
        fontFamily: 'Orbitron, Arial, sans-serif',
        fontWeight: '700',
        fontSize: Math.floor(window.innerWidth * 0.01),
        fill: 0xff0000
});

function updateCounter(value: number) {
        const minutes = Math.floor(value / 60);
        const seconds = value % 60;
        const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        counterText.text = timeString;
}

setInterval(() => {
        setTimer(getSeconds() + 1);
        updateCounter(getSeconds());
}, 1000);

function createTimer(): void {
    const originalWidth = 1536;
    const originalHeight = 768;
    const originalKeyPadOffsetX = 445;
    const originalKeyPadOffsetY = 335;

    const keypadXRatio = originalKeyPadOffsetX / originalWidth;
    const keypadYRatio = originalKeyPadOffsetY / originalHeight;

    const scaleX = background.width / originalWidth;
    const scaleY = background.height / originalHeight;
    const scale = Math.max(scaleX, scaleY);

    const scaledWidth = originalWidth * scale;
    const scaledHeight = originalHeight * scale;

    const bgX = background.x;
    const bgY = background.y;

    const keypadRealX = bgX + scaledWidth * keypadXRatio;
    const keypadRealY = bgY + scaledHeight * keypadYRatio;

    counterText.position.set(keypadRealX, keypadRealY);
    counterText.style.fontSize = Math.floor(window.innerWidth * 0.01);

    if (!app.stage.children.includes(counterText)) {
        app.stage.addChild(counterText);
    }
}

eventBus.on('timerReset', () => {
    createTimer();
})

function handleResize() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    
    setTimeout(() => {
        start();
    }, 100);
}

window.addEventListener('resize', handleResize);
window.matchMedia('screen').addEventListener('change', handleResize);

let lastScreenX = window.screenX;
let lastScreenY = window.screenY;

setInterval(() => {
    if (window.screenX !== lastScreenX || window.screenY !== lastScreenY) {
        lastScreenX = window.screenX;
        lastScreenY = window.screenY;
        handleResize();
    }
}, 1000);

function start() {
    app.stage.removeChildren();

    const scaleX = app.screen.width / bgTexture.width;
    const scaleY = app.screen.height / bgTexture.height;
    const scale = Math.max(scaleX, scaleY);

    background.scale.set(scale);
    background.x = (app.screen.width - background.width) / 2;
    background.y = (app.screen.height - background.height) / 2;

    app.stage.addChild(background);
    createTimer();

    if (originalDoorWidth === undefined) {
        originalDoorWidth = door.width;
        originalDoorHeight = door.height;
    }

    const desiredWidth = app.screen.width * config.safeClosedDoor.scaleRatio;
    const scaleRatio = desiredWidth / originalDoorWidth;
    
    door.scale.set(scaleRatio);

    door.x = app.screen.width / 2 + config.safeClosedDoor.offsetX;
    door.y = app.screen.height / 2 + config.safeClosedDoor.offsetY;

    app.stage.addChild(door);
}

await loadTextures();
const config = await loadConfig();
const bgTexture = Texture.from('images/bg.png');
background = new Sprite(bgTexture);
let code = generateCode();
const door = new SafeDoor(code, config);
start();