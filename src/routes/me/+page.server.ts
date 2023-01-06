import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load = (({ locals }) => {
    if (!locals.session) throw error(401);
    
    return {
        ...locals.session
    };
}) satisfies PageServerLoad;
