import { error, json } from "@sveltejs/kit";
import z from "zod";
import type { RequestHandler } from "./$types";
import { isAllDefined } from "$lib/utils";

const schema = z.array(z.string().min(1).max(100));

export const POST = (async ({ request, params, locals }) => {
	if (!locals.session) throw error(401);
	if (!locals.session.user.role.permissions.includes('vote')) throw error(403);

	const categoryId = Number(params.category);

	const categoryExists = await locals.db.orderCategory.count({ where: { id: categoryId } }) == 0;
	if (categoryExists) throw error(404, "Category not found");

	const judgeId = locals.session.user.id;

	const alreadyFinalized = await locals.db.orderFinalized.count({ where: { categoryId: categoryId, userId: judgeId } }) != 0;
	if (alreadyFinalized) throw error(400, "Cannot change ordering after it has been finalized");

	const dirtyData = await request.json().catch(() => ({}));
	const parseResult = schema.safeParse(dirtyData);
	if (!parseResult.success) throw error(400, "Invalid format");
	const order = parseResult.data;

	const duplicatesFound = new Set(order).size !== order.length;
	if (duplicatesFound) throw error(400, "Found duplicate class names");

	const classRecords = await locals.db.class.findMany();
	const lengthMismatch = order.length != classRecords.length;
	if (lengthMismatch) throw error(400, "Invalid number of class names");

	const classNameToIdMap = new Map(classRecords.map(x => [x.name, x.id]));
	const classIds = order.map(x => classNameToIdMap.get(x));
	if (!isAllDefined(classIds)) throw error(400, "A class name was not found");

	for (let i = 0; i < order.length; i++) {
		const placement = i + 1;
		const classId = classIds[i];
		const placementRecord = await locals.db.placement.findUnique({
			where: { userId_categoryId_classId: { categoryId: categoryId, classId: classId, userId: judgeId } }
		});
		if (placementRecord) {
			await locals.db.placement.update({
				where: { userId_categoryId_classId: { categoryId: categoryId, classId: classId, userId: judgeId } },
				data: { placement: placement }
			});
		}
		else {
			await locals.db.placement.create({
				data: { categoryId: categoryId, classId: classId, userId: judgeId, placement: placement }
			});
		}
	}

	return json("Success");

}) satisfies RequestHandler;
