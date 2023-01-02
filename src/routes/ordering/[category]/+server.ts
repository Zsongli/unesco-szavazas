import { error, json } from "@sveltejs/kit";
import z from "zod";
import type { RequestHandler } from "./$types";

const schema = z.array(z.string().min(1).max(30));

export const POST = (async ({ request, params, cookies }) => {
	// TODO: validate session
	// TODO: make sure user is a judge

	let category = params.category;
	// TODO: make sure category exists

	let judgeId = "JUDGE_ID_HERE"; // TODO: get current judge's user ID

	let finalized = false; // TODO: get finalized state
	if (finalized) throw error(400, "Cannot change ordering after it has been finalized");

	let dirtyData = await request.json().catch(() => ({}));
	let parseResult = schema.safeParse(dirtyData);
	if (!parseResult.success) throw error(400, "Invalid format");
	let data = parseResult.data;

	let length = 6; // TODO: get length of class table
	if (data.length != length) throw error(400, "Invalid number of elements");
	// TODO: check if each element in data is a valid class

	for (let i = 0; i < data.length; i++) {
		let place = i + 1;
		let klass = data[i];
		// TODO: in the placement table set value of `place` to `place` in row with key class=`klass`, key judge=`judgeId` key category=`category`
	}

	return json("Success");
}) satisfies RequestHandler;
