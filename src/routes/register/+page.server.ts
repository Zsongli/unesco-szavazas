import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import z from "zod";
import { hash } from "$lib/server/auth/hashing";

export const load: PageServerLoad = async ({ locals }) => {
    // if (!locals.session) throw error(401);
    // if (!locals.session.user.role.permissions.includes("register")) throw error(403);
};

const registrationSchema = z.object({
    email: z.string({ required_error: "E-mail cím megadása szükséges!", invalid_type_error: "Hibás e-mail cím formátum!" }).trim().min(1, "E-mail cím megadása szükséges!").email("Hibás e-mail cím formátum!").endsWith("@szlgbp.hu", "Csak lászlós e-mail címek használhatóak!"),
    fullname: z.string({ required_error: "Teljes név megadása szükséges!", invalid_type_error: "Hibás teljes név formátum!" }).trim().min(1, "Teljes név megadása szükséges!").refine(name => name.split(" ").length >= 2, "A teljes név legalább egy vezetéknévből és egy keresztnévből áll!"),
    password: z.string({ required_error: "Jelszó megadása szükséges!", invalid_type_error: "Hibás jelszó formátum" }).min(1, "Jelszó megadása szükséges!").min(8, "A jelszónak legalább 8 karakter hosszúnak kell lennie!")
});

export const actions: Actions = {
    async default({ request, locals }) {
        // if (!locals.session) throw error(401);
        // if (!locals.session.user.role.permissions.includes("register")) throw error(403);

        const formData = Object.fromEntries(await request.formData());
        const { password: _, ...data } = formData;

        const result = registrationSchema.safeParse(formData);

        if (!result.success) return fail(400, { data, errors: result.error.flatten().fieldErrors });

        const { email, password, fullname: name } = result.data;

        const user = await locals.db.user.findUnique({ where: { email: email } });

        if (user) return fail(400, { data, message: "Az e-mail cím már foglalt." });

        const defaultRoleRecord = await locals.db.role.findFirst();
        if (!defaultRoleRecord) {
            console.error("/register -> Couldn't assign default role as no roles exist");
            return fail(400, { data, message: "Rendszerhiba történt" });
        }

        await locals.db.user.create({
            data: {
                email,
                password: hash(password),
                name,
                roleId: defaultRoleRecord.id
            }
        });

        console.log("Sikeres regisztráció: " + email);
        return { data, message: "Sikeres regisztráció." };
    }
};