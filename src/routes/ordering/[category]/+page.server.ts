import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, cookies }) => {
	// TODO: validate session
	// TODO: make sure user is a judge

	// TODO: get all categories
	const categories = ["Előadásmód", "Díszlet", "Információ", "Tánc", "Humor"];

	let category = params.category;
	let categoryInd = categories.indexOf(category);
	if (categoryInd == -1) throw error(404, "Category not found");
	// TODO: make sure category exists

	let judgeId = "JUDGE_ID_HERE"; // TODO: get current judge's user ID

	// TODO: make sure ordering exists for current judge, else, initialize
	// TODO: get ordering for current judge and category, orderby `place` ascending
	let data = [
		{ class: "9.A" },
		{ class: "10.B" },
		{ class: "10.C" },
		{ class: "10.D" },
		{ class: "9.E" },
		{ class: "9.F" }
	];
	let order = data.map((x) => x.class);

	let finalized = false; // TODO: get whether judge is finalized

	let nextCategory = categories[(categoryInd + 1) % categories.length];
	let prevCategory = categories[(categoryInd - 1 + categories.length) % categories.length];
	return {
		order: order,
		finalized: finalized,
		navigationInfo: {
			nextCategory: nextCategory,
			prevCategory: prevCategory
		}
	};
}) satisfies PageServerLoad;
