import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    if (!locals.session) throw error(401);
    if (!locals.session.user.role.permissions.includes("view-results")) throw error(403);

    return {

    };
}) satisfies PageServerLoad;