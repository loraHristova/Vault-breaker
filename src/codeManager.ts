let currentCode: number[] = [];

export function generateCode(): number[] {
    currentCode = [
        Math.floor(Math.random() * 9) + 1,
        Math.floor(Math.random() * 9) + 1,
        Math.floor(Math.random() * 9) + 1,
    ];
    console.log(`${currentCode[0]}-${currentCode[1]}-${currentCode[2]}`);
    return currentCode;
}

export function getCurrentCode(): number[] {
    return currentCode;
}

export function resetCode(): number[] {
    return generateCode();
}
