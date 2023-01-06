import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { mod } from "$lib/utils";

export const load = (async ({ params, locals }) => {
	if (!locals.session) throw error(401);
	if (!locals.session.user.role.permissions.includes('vote')) throw error(403);

	const judgeId = locals.session.user.id;

	const categoryId = Number(params.category);
	const categoryRecord = await locals.db.orderCategory.findUnique({ where: { id: categoryId } });
	if (!categoryRecord) throw error(404, "Category not found");
	const categoriesLength = await locals.db.orderCategory.count();

	const placementRecords = await locals.db.placement.findMany({ where: { categoryId: categoryRecord.id, userId: judgeId }, include: { class: true }, orderBy: { placement: 'asc' } });
	const placementClassIds = placementRecords.map(x => x.classId);
	const order = placementRecords.map(x => x.class.name);
	const finalized = await locals.db.orderFinalized.count({ where: { categoryId: categoryRecord.id, userId: judgeId } }) != 0;
	const classRecords = await locals.db.class.findMany();

	// This assumes that the ID counter started from 1
	const nextCategory = await locals.db.orderCategory.findFirstOrThrow({ where: { id: mod(categoryId, categoriesLength) + 1 } });
	const prevCategory = await locals.db.orderCategory.findFirstOrThrow({ where: { id: mod(categoryId - 2, categoriesLength) + 1 } });
	const remainingClassNames = classRecords.filter(x => !placementClassIds.includes(x.id)).map(x => x.name);
	const combinedOrder = [...order, ...remainingClassNames];

	return {
		categoryName: categoryRecord.name,
		order: combinedOrder,
		finalized: finalized,
		navigationInfo: {
			nextCategory: {
				id: nextCategory.id,
				name: nextCategory.name
			},
			prevCategory: {
				id: prevCategory.id,
				name: prevCategory.name
			}
		}
	};
}) satisfies PageServerLoad;