export function groupByProps<T extends Record<string, string | number>, K extends (keyof T)[]>(arr: T[], props: K) {
    let map = new Map<string, T[]>();
    arr.forEach(o => {
        var group = hashFromProps(o, props);
        if (!map.has(group)) map.set(group, []);
        map.get(group)?.push(o);
    });
    return {
        get(by: { [P in K[number]]: T[P] }) {
            return map.get(hashFromProps(by, props)) ?? [];
        }
    };

}
function hashFromProps<T extends Record<string, string | number>, K extends (keyof T)[]>(obj: T, props: K) {
    return JSON.stringify(props.map(x => obj[x]));
}

export function makeValueSet<T extends Record<string, string | number>>(arr: T[]) {
    const keys = arr.length === 0 ? [] : Object.keys(arr[0]);
    const finalizedSet = new Set<string>(arr.map(x => hashFromProps(x, keys)));
    return {
        has(obj: T) {
            return finalizedSet.has(hashFromProps(obj, keys));
        }
    };
}