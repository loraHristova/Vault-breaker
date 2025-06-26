import { Application } from '@pixi/app';
import { Sprite } from '@pixi/sprite';
import { loadTextures } from './assets';
import { SafeDoor } from './safeDoor';
import { loadConfig } from './configLoader';

const app = new Application({
    resizeTo: window,
    backgroundAlpha: 0,
});

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
   
    const door = new SafeDoor();
    door.scale.set(config.safeDoor.scaleRatio);
    door.x = app.screen.width / 2 + config.safeDoor.offsetX;
    door.y = app.screen.height / 2 + config.safeDoor.offsetY;
    app.stage.addChild(door);
}

start();