export interface SafeConfig {
    offsetX: number;
    offsetY: number;
    scaleRatio: number;
}

export interface Config {
    safeClosedDoor: SafeConfig;
    safeOpenDoor: SafeConfig;
    safeHandle: SafeConfig;
}