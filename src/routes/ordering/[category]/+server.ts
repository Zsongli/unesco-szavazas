import { error, json } from "@sveltejs/kit";
import z from "zod";
import type { RequestHandler } from "./$types";
import * as db from "$lib/server/fakeDb";
import { isAllDefined } from "$lib/utils";

const schema = z.array(z.string().min(1).max(30)).refine(x => new Set(x).size === x.length, { message: "Found duplicate class names", });

export const POST = (async ({ request, params, cookies }) => {
	// TODO: validate session
	// TODO: make sure user is a judge
	let category = params.category;
	let categoryId = db.propFromKey(db.categoryTable, "id", "name", category); // TODO: change to real DB call
	if (categoryId === undefined) throw error(404, "Category not found");
	let judgeId = 0; // TODO: get current judge's user ID

	let finalized = db.finalizedTable.filter(x => x.category == categoryId && x.judge == judgeId).length != 0;
	if (finalized) throw error(400, "Cannot change ordering after it has been finalized");

	let dirtyData = await request.json().catch(() => ({}));
	let parseResult = schema.safeParse(dirtyData);
	if (!parseResult.success) throw error(400, "Invalid format");
	let order = parseResult.data;

	let length = db.classTable.length;
	if (order.length != length) throw error(400, "Invalid number of class names");

	let classIds = order.map(x => db.propFromKey(db.classTable, "id", "name", x));
	if (!isAllDefined(classIds)) throw error(400, "Class name was not found");

	for (let i = 0; i < order.length; i++) {
		let place = i + 1;
		let classId = classIds[i];

		let record = db.placementTable.filter(x => x.category == categoryId && x.class == classId && x.judge == judgeId).at(0);

		if (record === undefined) db.placementTable.push({ category: categoryId, class: classId, judge: judgeId, placement: place });
		else record.placement = place;
	}
	return json("Success");
}) satisfies RequestHandler;
