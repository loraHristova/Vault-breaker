export async function customWait(miliseconds: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => {return resolve()}, miliseconds);
    }); 
}