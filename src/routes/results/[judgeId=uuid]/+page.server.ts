import type { PageServerLoad } from './$types';
import { groupByProps } from '$lib/utils';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
    if (!locals.session) throw error(401);
    if (!locals.session.user.role.permissions.includes('view-results')) throw error(403);

    const judgeId = params.judgeId;
    const judgeRecord = await locals.db.user.findUnique({ where: { id: judgeId } });
    if (!judgeRecord) throw error(404);

    const categoryRecords = await locals.db.orderCategory.findMany();
    const classRecords = await locals.db.class.findMany();
    const placementRecords = await locals.db.placement.findMany({ where: { userId: judgeId } });
    const categories = categoryRecords.map(x => x.name);
    const categoryIds = categoryRecords.map(x => x.id);
    const classes = classRecords.map(x => ({ name: x.name, country: x.country }));
    const classIds = classRecords.map(x => x.id);
    const groupResults = groupByProps(placementRecords, ["categoryId", "classId"]);
    const finalizedSet = new Set((await locals.db.orderFinalized.findMany({ where: { userId: judgeId } })).map(x => x.categoryId));
    const tableData = classIds.map(cl =>
        categoryIds.map(cat =>
            finalizedSet.has(cat)
                ? groupResults.get({ categoryId: cat, classId: cl }).at(0)?.placement
                : undefined
        )
    );
    return {
        categories: categories,
        classes: classes,
        tableData: tableData,
        judgeName: judgeRecord.name
    };
}) satisfies PageServerLoad


