import {Assets} from '@pixi/assets'

const texturesToLoad = [
    'images/bg.png',
    'images/blink.png',
    'images/door.png',
    'images/doorOpen.png',
    'images/doorOpenShadow.png',
    'images/handle.png',
    'images/handleShadow.png'
];

export async function loadTextures() {
    await Assets.load(texturesToLoad);
}