import type { PageServerLoad } from './$types';
import * as db from '$lib/server/fakeDb';
import { findFirst } from '$lib/utils';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, cookies }) => {
    let judgeId = parseInt(params.judgeId); // TODO: validate better with zod?


    // TODO: validate session
    // TODO: make sure that has view access (either is an "admin" or userId is same as the page's judgeId)

    let judgeName = db.propFromKey(db.judgeTable, 'name', 'id', judgeId);
    if (judgeName === undefined) throw error(404, "Judge doesn't exists");

    let categories = db.categoryTable.map(x => x.name);
    let categoryIds = db.categoryTable.map(x => x.id);
    let classes = db.classTable.map(x => ({ name: x.name, country: x.country }));
    let classIds = db.classTable.map(x => x.id);
    let filtered = db.placementTable.filter(x => x.judge == judgeId);

    let tableData = classIds.map(cl => categoryIds.map(cat => findFirst(filtered, x => x.class == cl && x.category == cat)?.placement));





    return {
        categories: categories,
        classes: classes,
        tableData: tableData,
        judgeName: judgeName
    };
}) satisfies PageServerLoad


