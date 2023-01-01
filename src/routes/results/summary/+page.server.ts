import type { PageServerLoad } from './$types';

// This is the fake database
const countryTable = [
    { class: "9.A", country: "Kiribati" },
    { class: "10.B", country: "Pakisztán" },
    { class: "10.C", country: "Chile" },
    { class: "10.D", country: "Montenegro" },
    { class: "9.E", country: "Zimbabwe" },
    { class: "9.F", country: "Belize" },
]

const scoreTable = [
    { class: "9.A", Előadásmód: 10, Díszlet: 10, Információ: 10, Tánc: 10, Humor: 10 },
    { class: "10.B", Előadásmód: 10, Díszlet: 10, Információ: 10, Tánc: 10, Humor: 10 },
    { class: "10.C", Előadásmód: 10, Díszlet: 10, Információ: 10, Tánc: 10, Humor: 10 },
    { class: "10.D", Előadásmód: 10, Díszlet: 10, Információ: 10, Tánc: 10, Humor: 10 },
    { class: "9.E", Előadásmód: 10, Díszlet: 10, Információ: 10, Tánc: 10, Humor: 10 },
    { class: "9.F", Előadásmód: 10, Díszlet: 10, Információ: 10, Tánc: 10, Humor: 10 },
]

type Class = {
    name: string
    country: string
}

type Score = {
    [key: string]: number
}

type ClassWithScore = Class & { score: Score }

type Summary = ClassWithScore[]

function getSummary(): Summary {
    return countryTable.map(x => {
        let score: any = { ...scoreTable.find(s => s.class == x.class)! }
        delete score.class
        return { name: x.class, country: x.country, score: (score as Score) }
    })
}


export const load: PageServerLoad = () => {
    return { summary: getSummary() };
}


