import type { LayoutServerLoad } from "./$types";
import { assertVoterSession } from "$lib/server/ordering";

export const load: LayoutServerLoad = async ({ locals }) => {
    assertVoterSession(locals.session);
    const categories = locals.db.orderCategory.findMany({ select: { id: true, name: true } });

    return {
        categories: categories
    };
};
