import { Application } from '@pixi/app';
import { Sprite } from '@pixi/sprite';
import { loadTextures } from './assets';
import { SafeDoor } from './safeDoor';
import { loadConfig } from './configLoader';
import { extensions, ExtensionType } from '@pixi/core';
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
            
    const background = Sprite.from('images/bg.png');
    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);
   
    let code = generateCode();

    const door = new SafeDoor(code);
    door.scale.set(config.safeDoor.scaleRatio);
    door.x = app.screen.width / 2 + config.safeDoor.offsetX;
    door.y = app.screen.height / 2 + config.safeDoor.offsetY;

    door.setHandleOffset(config.safeHandle.offsetX, config.safeHandle.offsetY);
    app.stage.addChild(door);
}

start();