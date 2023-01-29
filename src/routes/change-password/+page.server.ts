import { error, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import z from "zod";
import { matches, hash } from "$lib/server/auth/hashing";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session) throw error(403);
}

const changePasswordSchema = z.object({
    oldPassword: z.string({ required_error: "Jelenlegi jelszó megadása szükséges!", invalid_type_error: "Hibás jelenlegi jelszó formátum!" }).min(1, "Jelenlegi jelszó megadása szükséges!").min(8, "A jelenlegi jelszónak legalább 8 karakter hosszúnak kell lennie!"),
    newPassword: z.string({ required_error: "Új jelszó megadása szükséges!", invalid_type_error: "Hibás új jelszó formátum!" }).min(1, "Új jelszó megadása szükséges!").min(8, "Az új jelszónak legalább 8 karakter hosszúnak kell lennie!"),
});

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.session) throw error(403);

        const result = changePasswordSchema.safeParse(Object.fromEntries(await request.formData()));
        if (!result.success) return fail(400, { errors: result.error.flatten().fieldErrors });

        const { oldPassword, newPassword } = result.data;

        const user = await locals.db.user.findUnique({ where: { id: locals.session.user.id } });
        if (!user) throw error(403); // Should never happen, except we're using jwt, wth bruh

        if (!matches(oldPassword, user.password)) return fail(400, { message: "A megadott jelenlegi jelszó helytelen!" });

        await locals.db.user.update({ where: { id: locals.session.user.id }, data: { password: hash(newPassword) } });
        return { message: "A jelszó sikeresen megváltozott!" };
    }
}