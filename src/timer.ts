let totalSeconds = 0;

export function getSeconds() {
    return totalSeconds;
}

export function resetTimer(): void {
    totalSeconds = 0;
}

export function setTimer(newSeconds: number): void {
    totalSeconds = newSeconds;
}