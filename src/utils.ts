export function shuffle(array: any[]): any[] {
    let shuffled_array: any[] = array.slice(0);
    for (let l: number = shuffled_array.length; l > 0; --l) {
        let i: number = Math.floor(Math.random() * l);
        [shuffled_array[i], shuffled_array[l-1]] = [shuffled_array[l-1], shuffled_array[i]];
    }
    return shuffled_array;
}
