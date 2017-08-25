export function shuffle(array: any[]): any[] {
    let shuffled_array: any[] = array.slice(0);
    for (let l: number = shuffled_array.length; l > 0; --l) {
        let i: number = Math.floor(Math.random() * l);
        [shuffled_array[i], shuffled_array[l-1]] = [shuffled_array[l-1], shuffled_array[i]];
    }
    return shuffled_array;
}

export function difference(base: any[], others: any[]): any[] {
    let result = [];
    for (let item of base) {
        if (others.indexOf(item) === -1) {
            result.push(item);
        }
    }
    return result;
}

let seed: number = Math.floor(Date.now() / (1000 * 60 * 60 * 24));

export function random(): number {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
}
