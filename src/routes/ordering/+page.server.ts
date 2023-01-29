import type { PageServerLoad } from "./$types";
import { assertVoterSession } from "$lib/server/ordering";
import { redirect } from "@sveltejs/kit";

export const load = (async ({ locals }) => {
	assertVoterSession(locals.session);
	const categoryRecord = await locals.db.orderCategory.findFirst({ select: { id: true } });
	throw redirect(302, `/ordering/${categoryRecord?.id}`);
}) satisfies PageServerLoad;
