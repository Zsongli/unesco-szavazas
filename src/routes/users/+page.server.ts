import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    if (!locals.session) throw error(401);
    if (!locals.session.user.role.permissions.includes("manage-users")) throw error(403);

    return {
        users: locals.db.user.findMany({ include: { role: { select: { id: true } } } }),
        roles: locals.db.role.findMany().then(roleRecords => roleRecords.map(role => ({ value: role.id.toString(), name: role.name })))
    };

}) satisfies PageServerLoad;