import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { assertNotFinalized, assertVoterSession, finalize, getCategoryOrThrow, parseOrderingRequestOrThrow, upsertOrderingRecord, validateOrderingOrThrow } from "$lib/server/ordering";
import z from "zod";

export const POST = (async ({ request, params, locals }) => {
	assertVoterSession(locals.session);
	const categoryId = Number(params.category);
	const judgeId = locals.session.user.id;
	await getCategoryOrThrow(locals.db, categoryId);

	await assertNotFinalized(locals.db, judgeId, categoryId);

	const orderingRequest = await parseOrderingRequestOrThrow(request);
	const classIdsOrdered = orderingRequest.ordering;
	await validateOrderingOrThrow(classIdsOrdered, locals.db)

	if (orderingRequest.finalize) await finalize(locals.db, judgeId, categoryId)
	for (let i = 0; i < classIdsOrdered.length; i++) {
		const placement = i + 1;
		const classId = classIdsOrdered[i];
		await upsertOrderingRecord(locals.db, judgeId, categoryId, classId, placement);
	}

	return json("Success");
}) satisfies RequestHandler;

const revertFinalizationSchema = z.object({
	judgeId: z.string().uuid(),
});
export const DELETE = (async ({ request, params, locals }) => {
	if (!locals.session) throw error(401);
	if (!locals.session?.user.role.permissions.includes("revert-finalizations")) throw error(403);


	const result = revertFinalizationSchema.safeParse(await request.json().catch(() => ({})));
	if (!result.success) throw error(400, "Invalid request body");
	const categoryId = Number(params.category);
	const userId = result.data.judgeId;

	if(!await locals.db.orderFinalized.findUnique({where: {userId_categoryId: {userId, categoryId}}})) throw error(400, "Finalization record does not exist");

	await locals.db.orderFinalized.delete({
		where: {
			userId_categoryId: {
				userId,
				categoryId
			}
		}
	});

	return json("Success");
}) satisfies RequestHandler;
