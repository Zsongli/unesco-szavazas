import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    if(!locals.session) throw error(401);
    if(!locals.session.user.role.permissions.includes("view-results")) throw error(403);

    return {
        judges: await locals.db.user.findMany({
            where: {
                NOT: {
                    placement: {
                        none: {} // filters for non-empty relations
                    }
                }
            },
            select: {
                id: true,
                name: true
            }
        })
    };
}) satisfies LayoutServerLoad;