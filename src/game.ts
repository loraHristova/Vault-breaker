import { Application } from '@pixi/app';
import { Sprite } from '@pixi/sprite';
import { loadTextures } from './assets';
import { SafeDoor } from './safeDoor';
import { loadConfig } from './configLoader';
import { extensions, ExtensionType, Texture } from '@pixi/core';
import { EventSystem } from '@pixi/events';
import { generateCode, getCurrentCode } from './codeManager';

extensions.add({
    name: 'EventSystem',
    type: ExtensionType.RendererPlugin,
    ref: EventSystem,
});

const app = new Application({
    resizeTo: window,
    backgroundAlpha: 0,
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

async function start() {
    await loadTextures();
    const config = await loadConfig();
            
    const bgTexture = Texture.from('images/bg.png');
    const background = new Sprite(bgTexture);

    const scaleX = app.screen.width / bgTexture.width;
    const scaleY = app.screen.height / bgTexture.height;
    const scale = Math.min(scaleX, scaleY);

    background.scale.set(scale);

    background.x = (app.screen.width - background.width) / 2;
    background.y = (app.screen.height - background.height) / 2;

    app.stage.addChild(background);
   
    let code = generateCode();

    const door = new SafeDoor(code, config);
    const desiredWidth = window.innerWidth * config.safeClosedDoor.scaleRatio;
    const scaleRatio = desiredWidth / door.width;
    door.scale.set(scaleRatio);

    door.x = app.screen.width / 2 + config.safeClosedDoor.offsetX;
    door.y = app.screen.height / 2 + config.safeClosedDoor.offsetY;

    app.stage.addChild(door);
}

start();