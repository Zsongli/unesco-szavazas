import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { groupByProps, makeValueSet } from "$lib/utils";

export const load = (async ({ locals }) => {
    if (!locals.session) throw error(401);
    if (!locals.session.user.role.permissions.includes("view-results")) throw error(403);

    const categoryRecords = await locals.db.orderCategory.findMany();
    const classRecords = await locals.db.class.findMany();
    const placementRecords = await locals.db.placement.findMany();
    const categories = categoryRecords.map(x => x.name);
    const categoryIds = categoryRecords.map(x => x.id);
    const classes = classRecords.map(x => ({ name: x.name, country: x.country }));
    const classIds = classRecords.map(x => x.id);
    const groupResults = groupByProps(placementRecords, ["categoryId", "classId"]);
    const finalizedSet = makeValueSet(await locals.db.orderFinalized.findMany());
    const tableData = classIds.map(cl =>
        categoryIds.map(cat =>
            groupResults.get({ categoryId: cat, classId: cl })
                .filter(x => finalizedSet.has({ categoryId: x.categoryId, userId: x.userId }))
                .map(x => x.placement)
                .reduce((a, b) => a + b, 0)
        )
    );

    return {
        categories: categories,
        classes: classes,
        tableData: tableData
    };
}) satisfies PageServerLoad;