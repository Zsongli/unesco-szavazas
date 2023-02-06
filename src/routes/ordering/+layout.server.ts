import type { LayoutServerLoad } from "./$types";
import { assertVoterSession } from "$lib/server/ordering";

export const load: LayoutServerLoad = async ({ locals }) => {
    assertVoterSession(locals.session);

    const [categories, finalized] = await Promise.all([
        locals.db.orderCategory.findMany({ select: { id: true, name: true } }),
        locals.db.orderFinalized.findMany({ select: { categoryId: true, userId: true } })
    ])

    return {
        categories: categories.map(c => ({ id: c.id, name: c.name, finalized: finalized.some(f => f.categoryId === c.id && f.userId === locals.session!.user.id) }))
    };
};
