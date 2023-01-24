import { getCategoryOrThrow, assertNotFinalized, assertVoterSession, finalize } from "$lib/server/ordering";
import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ locals, params }) => {
        assertVoterSession(locals.session)
        const judgeId = locals.session.user.id;
        const categoryId = Number(params.category);
        await getCategoryOrThrow(locals.db, categoryId)
        await assertNotFinalized(locals.db, judgeId, categoryId);
        await finalize(locals.db, judgeId, categoryId)

        return { message: "A kategória véglegesítése sikeresen megtörtént." };
    }
}
