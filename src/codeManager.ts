import { MULTIPLIER, ADDED } from "./constants";

let currentCode: [number, string][] = [];

function randomNumber(): number {
    return Math.floor(Math.random() * MULTIPLIER) + ADDED;
}

function printPair(idx: number): string {
    return `${currentCode[idx][0]} ${currentCode[idx][1]}`;
}

export function generateCode(): [number, string][] {
    currentCode = [
        [randomNumber(), (randomNumber() % 2 === 0 ? "clockwise" : "counterclockwise")],
        [randomNumber(), (randomNumber() % 2 === 0 ? "clockwise" : "counterclockwise")],
        [randomNumber(), (randomNumber() % 2 === 0 ? "clockwise" : "counterclockwise")],
    ];
    console.log(`${printPair(0)}, ${printPair(1)}, ${printPair(2)}`);
    return currentCode;
}

export function getCurrentCode(): [number, string][] {
    return currentCode;
}

export function resetCode(): [number, string][] {
    return generateCode();
}
