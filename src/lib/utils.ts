export function isAllDefined<T>(arr: (T | undefined)[]): arr is T[] {
    return !arr.some(x => x === undefined);
}

export function mod(v: number, n: number) {
    return ((v % n) + n) % n;
}

export function findFirst<T>(arr: T[], pred: (e: T) => boolean) {
    return arr.filter(pred).at(0);
}