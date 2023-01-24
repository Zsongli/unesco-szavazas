import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { assertNotFinalized, assertVoterSession, getCategoryOrThrow, parseAndValidateOrderingFromRequestOrThrow, upsertClass as upsertOrderingRecord } from "$lib/server/ordering";

export const POST = (async ({ request, params, locals }) => {
	assertVoterSession(locals.session);
	const categoryId = Number(params.category);
	const judgeId = locals.session.user.id;
	await getCategoryOrThrow(locals.db, categoryId);
	await assertNotFinalized(locals.db, judgeId, categoryId);
	const classIdsOrdered = await parseAndValidateOrderingFromRequestOrThrow(request, locals.db)
	for (let i = 0; i < classIdsOrdered.length; i++) {
		const placement = i + 1;
		const classId = classIdsOrdered[i];
		await upsertOrderingRecord(locals.db, judgeId, categoryId, classId, placement);
	}
	
	return json("Success");
}) satisfies RequestHandler;
