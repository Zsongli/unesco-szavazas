export function isAllDefined<T>(arr: (T | undefined)[]): arr is T[] {
    return !arr.some(x => x === undefined);
}

type FilteredKeys<T, U> = { [P in keyof T]: T[P] extends U ? P : never }[keyof T];

export function orderBy<T, Prop extends FilteredKeys<T, number>>(arr: T[], prop: Prop) {
    return [...arr].sort((a, b) => <number>a[prop] - <number>b[prop]);
}

export function mod(v: number, n: number) {
    return ((v % n) + n) % n;
}

export function findFirst<T>(arr: T[], pred: (e: T) => boolean) {
    return arr.filter(pred).at(0);
}