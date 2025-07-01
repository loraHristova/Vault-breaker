import { SafeApp } from './safeApp';

async function main() {
    const app = new SafeApp();
    await app.init();
}

main();
