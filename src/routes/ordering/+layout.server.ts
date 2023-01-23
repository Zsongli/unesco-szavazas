import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
    if (!locals.session) throw error(401);
    if (!locals.session.user.role.permissions.includes('vote')) throw error(403);

    return {
        categories: locals.db.orderCategory.findMany({ orderBy: { id: 'asc' }, select: { id: true, name: true } })
    };
};
