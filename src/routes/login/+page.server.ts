import { fail, redirect, error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";
import z from "zod";
import { matches } from "$lib/server/auth/hashing";
import * as env from "$env/static/private"

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.session) throw error(403);
}

const loginSchema = z.object({
    email: z.string({ required_error: "E-mail cím megadása szükséges!", invalid_type_error: "Hibás e-mail cím formátum!" }).trim().min(1, "E-mail cím megadása szükséges!").email("Hibás e-mail cím formátum!").endsWith("@szlgbp.hu", "Csak lászlós e-mail címek használhatóak!"),
    password: z.string({ required_error: "Jelszó megadása szükséges!", invalid_type_error: "Hibás jelszó formátum!" }).min(1, "Jelszó megadása szükséges!").min(8, "A jelszónak legalább 8 karakter hosszúnak kell lennie!")
});

export const actions: Actions = {
    async default({ request, cookies, locals, url }) {
        if (locals.session) throw error(403);

        const formData = Object.fromEntries(await request.formData());
        const { password: _, ...data } = formData;

        const result = loginSchema.safeParse(formData);

        if (!result.success) return fail(400, { data, errors: result.error.flatten().fieldErrors });

        const { email, password } = result.data;

        const user = await locals.db.user.findFirst({
            where: {
                email: email
            },
            include: {
                role: {
                    select: {
                        name: true,
                        permissions: true
                    }
                }
            }
        });

        if (!user || !matches(password, user.password)) return fail(400, { data, message: "Az e-mail cím és a jelszó nem egyezik!" });

        const { password: __, roleId, ...tokenData } = user;
        cookies.set("session_token", locals.sessionIssuer.encode({ user: tokenData }, "7d"), { secure: url.protocol === "https:" });
        throw redirect(303, "/");
    }
}
