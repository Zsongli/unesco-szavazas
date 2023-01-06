import type { PageServerLoad } from './$types';
import { findFirst } from '$lib/utils';
import { error } from '@sveltejs/kit';
export const load = (async ({ params, locals }) => {
    if (!locals.session) throw error(401);
    if (!locals.session.user.role.permissions.includes('view-results')) throw error(403);

    const judgeId = params.judgeId;
    const judgeRecord = await locals.db.user.findFirst({ where: { id: judgeId } });
    if (!judgeRecord) throw error(404);

    const categoryRecords = await locals.db.orderCategory.findMany();
    const classRecords = await locals.db.class.findMany();
    const categories = categoryRecords.map(x => x.name);
    const categoryIds = categoryRecords.map(x => x.id);
    const classes = classRecords.map(x => ({ name: x.name, country: x.country }));
    const classIds = classRecords.map(x => x.id);
    const filtered = await locals.db.placement.findMany({ where: { userId: judgeId } });
    const tableData = classIds.map(cl => categoryIds.map(cat => findFirst(filtered, x => x.classId == cl && x.categoryId == cat)?.placement));

    return {
        categories: categories,
        classes: classes,
        tableData: tableData,
        judgeName: judgeRecord.name
    };
}) satisfies PageServerLoad


