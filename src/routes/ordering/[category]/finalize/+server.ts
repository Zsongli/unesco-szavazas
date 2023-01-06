import type { RequestHandler } from "./$types";
import * as db from '$lib/server/fakeDb';
import { error, json } from "@sveltejs/kit";

export const POST = (async ({ params, cookies }) => {
    // TODO: validate session
    // TODO: make sure user is a judge
    let category = params.category;
    let categoryId = db.propFromKey(db.categoryTable, "id", "name", category); // TODO: change to real DB call
    if (categoryId === undefined) throw error(404, "Category not found");

    let judgeId = 0; // TODO: get current judge's user ID

    let alreadyFinalized = db.finalizedTable.filter(x => x.category == categoryId && x.judge == judgeId).length != 0;
    if (alreadyFinalized) throw error(400, "Already finalized this category");

    db.finalizedTable.push({ category: categoryId, judge: judgeId });

    return json("Success");
}) satisfies RequestHandler;
