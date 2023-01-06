import { error, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
    async default({ locals, cookies }) {
        if (!locals.session) throw error(401);

        const token = cookies.get("session_token");
        if (!token) throw error(401);

        await locals.db.revokedToken.create({ data: { value: token } });
        cookies.delete("session_token");
    }
}
