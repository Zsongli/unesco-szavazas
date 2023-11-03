import type { PageServerLoad } from './$types';
import { groupByProps } from '$lib/utils';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
    if (!locals.session) throw error(401);
    if (!locals.session.user.role.permissions.includes('view-results')) throw error(403);

    const judgeId = params.judgeId;
    const judgeRecord = await locals.db.user.findUnique({ where: { id: judgeId }, include: { role: { select: { permissions: true } } } });
    if (!judgeRecord || !judgeRecord?.role.permissions.includes("vote")) throw error(404);

    const categoryRecords = await locals.db.orderCategory.findMany();
    const categoryIds = categoryRecords.map(x => x.id);
    const classRecords = await locals.db.class.findMany();
    const classIds = classRecords.map(x => x.id);
    const classes = classRecords.map(x => ({ name: x.name, }));
    const finalizedSet = new Set((await locals.db.orderFinalized.findMany({ where: { userId: judgeId } })).map(x => x.categoryId));

    const hideResults = !locals.session.user.role.permissions.includes('view-user-votes');

    const placementRecords = await locals.db.placement.findMany({ where: { userId: judgeId } });
    const groupResults = groupByProps(placementRecords, ["categoryId", "classId"]);
    const tableData = classIds.map(cl =>
        categoryIds.map(cat => groupResults.get({ categoryId: cat, classId: cl }).at(0)?.placement).map(x => hideResults && x !== undefined ? "hidden" : x)
    );


    return {
        categories: categoryRecords.map(x => ({ id: x.id, name: x.name, finalized: finalizedSet.has(x.id) })),
        classes: classes,
        tableData: tableData,
        judgeName: judgeRecord.name,
        canRevertFinalizations: locals.session.user.role.permissions.includes('revert-finalizations')
    };
}) satisfies PageServerLoad;
