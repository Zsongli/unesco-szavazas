import { error, json } from "@sveltejs/kit";
import z from "zod";
import type { RequestHandler } from "./$types";

const schema = z.array(z.number().int());

export const POST = (async ({ request, params, locals }) => {
	if (!locals.session) throw error(401);
	if (!locals.session.user.role.permissions.includes('vote')) throw error(403);

	const categoryId = Number(params.category);

	const categoryRecord = await locals.db.orderCategory.findUnique({ where: { id: categoryId } });
	if (!categoryRecord) throw error(404, "Category not found");

	const judgeId = locals.session.user.id;

	const finalizedRecord = await locals.db.orderFinalized.findUnique({ where: { userId_categoryId: { categoryId: categoryId, userId: judgeId } } });
	if (finalizedRecord) throw error(400, "Cannot change ordering after it has been finalized");

	const dirtyData = await request.json().catch(() => ({}));
	const parseResult = schema.safeParse(dirtyData);
	if (!parseResult.success) throw error(400, "Invalid format");
	const classIdsOrdered = parseResult.data;


	const orderClassIdSet = new Set(classIdsOrdered);
	if (orderClassIdSet.size !== classIdsOrdered.length) throw error(400, "Found duplicate classes");

	const classRecords = await locals.db.class.findMany();
	if (classIdsOrdered.length != classRecords.length) throw error(400, "Invalid number of classes");

	if (!classRecords.every(x => orderClassIdSet.has(x.id))) throw error(400, "Couldn't find a class in the ordering");

	for (let i = 0; i < classIdsOrdered.length; i++) {
		const placement = i + 1;
		const classId = classIdsOrdered[i];

		await locals.db.placement.upsert({
			where: { userId_categoryId_classId: { categoryId: categoryId, classId: classId, userId: judgeId } },
			update: { placement: placement },
			create: { categoryId: categoryId, classId: classId, userId: judgeId, placement: placement }
		});
	}

	return json("Success");

}) satisfies RequestHandler;
