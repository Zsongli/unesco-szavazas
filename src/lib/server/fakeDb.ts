import { findFirst } from "$lib/utils";

type PlacementRecord = {
    judge: number;
    category: number;
    class: number;
    placement: number;
};

type ClassRecord = {
    id: ID;
    name: string;
    country: string;
};

type CategoryRecord = {
    id: ID;
    name: string;
};

type FinalizedRecord = {
    judge: ID;
    category: number;
};

type JudgeRecord = {
    id: ID;
    name: string;
};

type ID = number;

export let placementTable: PlacementRecord[] = [
    { category: 0, judge: 0, class: 0, placement: 1 },
    { category: 0, judge: 0, class: 1, placement: 2 },
    { category: 0, judge: 0, class: 2, placement: 3 },
    { category: 0, judge: 0, class: 3, placement: 4 },
    { category: 0, judge: 0, class: 4, placement: 5 },
    { category: 0, judge: 0, class: 5, placement: 6 }
];

export let classTable: ClassRecord[] = [
    { id: 0, name: "9.A", country: "Kiribati" },
    { id: 1, name: "10.B", country: "Pakisztán" },
    { id: 2, name: "10.C", country: "Chile" },
    { id: 3, name: "10.D", country: "Montenegro" },
    { id: 4, name: "9.E", country: "Zimbabwe" },
    { id: 5, name: "9.F", country: "Belize" }
];

export let categoryTable: CategoryRecord[] = [
    { id: 0, name: "Előadásmód" },
    { id: 1, name: "Díszlet" },
    { id: 2, name: "Információ" },
    { id: 3, name: "Tánc" },
    { id: 4, name: "Humor" }
];

export let finalizedTable: FinalizedRecord[] = [];

export let judgeTable: JudgeRecord[] = [
    { id: 0, name: "Joe" },
    { id: 1, name: "Mama" }
];

export function propFromKey<Record, Key extends keyof Record, Prop extends keyof Record>(
    table: Record[],
    prop: Prop,
    key: Key,
    keyVal: Record[Key]
) {
    let record = findFirst(table, x => x[key] == keyVal);
    if (!record) return undefined;
    return record[prop]
}

