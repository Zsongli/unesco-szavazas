type MaybePromise<T> = T | Promise<T>;

type TableDelegate = {
    count: (...args: any[]) => MaybePromise<number>,
    createMany: (args?: { data: any[] }) => MaybePromise<any>,
};

interface CRUDClient {
    [key: string]: TableDelegate;
}

export default async function initDb<T extends CRUDClient>(db: T, data: Partial<{ [k in keyof T]: Parameters<T[k]["createMany"]>[0] }>) {
    for (const [key, value] of Object.entries(data))
        if (await db[key].count() === 0) {
            console.log(`Table "${key}" is empty, initializing with provided default data...`)
            await db[key].createMany(value);
        }
}
