import type { Config } from './configTypes';
    
export async function loadConfig(): Promise<Config> {
    const response = await fetch('/config/config.json');
    const config = await response.json();
    return config;
}