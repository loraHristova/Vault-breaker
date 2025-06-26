export interface SafeDoorConfig {
    offsetX: number;
    offsetY: number;
    scaleRatio: number;
}

export interface Config {
    safeDoor: SafeDoorConfig;
    safeHandle: SafeDoorConfig;
}