import { error, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ locals, params }) => {
        if (!locals.session) throw error(401);
        if (!locals.session.user.role.permissions.includes('vote')) throw error(403);

        const judgeId = locals.session.user.id;
        const categoryId = Number(params.category);

        const categoryRecord = await locals.db.orderCategory.findUnique({ where: { id: categoryId } });
        if (!categoryRecord) throw error(404, "Category not found");

        const finaliedRecord = await locals.db.orderFinalized.findUnique({ where: { userId_categoryId: { categoryId: categoryId, userId: judgeId } } });
        if (finaliedRecord) throw error(400, "Already finalized this category");

        await locals.db.orderFinalized.create({ data: { categoryId: categoryId, userId: judgeId } });

        return { message: "A kategória véglegesítése sikeresen megtörtént." };
    }
}
