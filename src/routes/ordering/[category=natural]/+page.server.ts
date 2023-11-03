import type { PageServerLoad } from "./$types";
import { getCategoryOrThrow, assertVoterSession, isFinalized } from "$lib/server/ordering";

export const load = (async ({ params, locals }) => {
    assertVoterSession(locals.session);

    const judgeId = locals.session.user.id;
    const categoryId = Number(params.category);
    const categoryRecord = await getCategoryOrThrow(locals.db, categoryId);

    const order = (await locals.db.placement.findMany({
        where: { categoryId: categoryId, userId: judgeId },
        select: { class: { select: { id: true, name: true, } } },
        orderBy: { placement: 'asc' }
    })).map(x => x.class);
    const orderClassIds = new Set<number>(order.map(x => x.id));

    const classRecords = await locals.db.class.findMany({ select: { id: true, name: true, } });
    const remainingClasses = classRecords.filter(x => !orderClassIds.has(x.id));
    const combinedOrder = [...order, ...remainingClasses];

    const finalized = isFinalized(locals.db, judgeId, categoryId);

    return {
        categoryName: categoryRecord.name,
        order: combinedOrder,
        finalized: finalized,
    };
}) satisfies PageServerLoad;
