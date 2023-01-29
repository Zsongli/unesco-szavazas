import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    throw error(405);
}) satisfies PageServerLoad;

export const actions: Actions = {
    async default({ locals, cookies }) {
        if (!locals.session) throw error(401);

        const token = cookies.get("session_token");
        if (!token) throw error(401);

        await locals.db.revokedToken.create({ data: { value: token } });
        cookies.delete("session_token");

        throw redirect(303, "/");
    }
}
