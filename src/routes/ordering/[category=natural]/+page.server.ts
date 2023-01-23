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

	const placementRecords = await locals.db.placement.findMany({ where: { categoryId: categoryRecord.id, userId: judgeId }, include: { class: true }, orderBy: { placement: 'asc' } });
	const placementClassIds = placementRecords.map(x => x.classId);
	const order = placementRecords.map(x => x.class);

	const classRecords = await locals.db.class.findMany();
	const remainingClasses = classRecords.filter(x => !placementClassIds.includes(x.id));
	const combinedOrder = [...order, ...remainingClasses].map(x => ({ id: x.id, name: x.name, country: x.country }));

	const finalizedRecord = await locals.db.orderFinalized.findUnique({ where: { userId_categoryId: { categoryId: categoryRecord.id, userId: judgeId } } });

	return {
		categoryName: categoryRecord.name,
		order: combinedOrder,
		finalized: !!finalizedRecord,
	};
}) satisfies PageServerLoad;
