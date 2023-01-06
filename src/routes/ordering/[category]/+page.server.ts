import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import * as db from "$lib/server/fakeDb";
import { mod, orderBy } from "$lib/utils";

export const load = (async ({ params, cookies }) => {
	// TODO: validate session
	// TODO: make sure user is a judge
	let judgeId = 0; // TODO: get current judge's user ID

	let category = params.category;
	let categoryId = db.propFromKey(db.categoryTable, "id", "name", category); // TODO: change to real DB call
	if (categoryId === undefined) throw error(404, "Category not found");
	let categoriesLength = db.categoryTable.length;

	// TODO: make sure every class has a placement for current judge, else initialize

	let order = orderBy(db.placementTable.filter((x) => x.category == categoryId && x.judge == judgeId), 'placement')
		.map(x => db.propFromKey(db.classTable, 'name', 'id', x.class));
	

	let finalized = db.finalizedTable.filter(x => x.category == categoryId && x.judge == judgeId).length != 0;

	// This assumes that the ID counter started from 0
	let nextCategory = db.propFromKey(db.categoryTable, "name", "id", mod(categoryId + 1, categoriesLength));
	let prevCategory = db.propFromKey(db.categoryTable, "name", "id", mod(categoryId - 1, categoriesLength));

	return {
		order: order,
		finalized: finalized,
		navigationInfo: {
			nextCategory: nextCategory,
			prevCategory: prevCategory
		}
	};
}) satisfies PageServerLoad;