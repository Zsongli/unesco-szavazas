import type { RequestHandler } from "./$types";
import { error, json } from "@sveltejs/kit";

export const POST = (async ({ params, locals }) => {
    if (!locals.session) throw error(401);
    if (!locals.session.user.role.permissions.includes('vote')) throw error(403);

    const judgeId = locals.session.user.id;
    const categoryId = Number(params.category);

    const categoryNotFound = await locals.db.orderCategory.count({ where: { id: categoryId } }) === 0;
    if (categoryNotFound) throw error(404, "Category not found");

    const alreadyFinalized = await locals.db.orderFinalized.count({ where: { categoryId: categoryId, userId: judgeId } }) !== 0;
    if (alreadyFinalized) throw error(400, "Already finalized this category");

    await locals.db.orderFinalized.create({ data: { categoryId: categoryId, userId: judgeId } });
    
    return json("Success");
}) satisfies RequestHandler;
