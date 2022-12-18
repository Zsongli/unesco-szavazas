import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";
import z from "zod";

const loginPageSchema = z.object({
    email: z.string({ required_error: "E-mail cím megadása szükséges!", invalid_type_error: "Hibás e-mail cím formátum!" }).trim().min(1, "E-mail cím megadása szükséges!").email("Hibás e-mail cím formátum!").endsWith("@szlgbp.hu", "Csak lászlós e-mail címek használhatóak!"),
    password: z.string({ required_error: "Jelszó megadása szükséges!", invalid_type_error: "Hibás jelszó formátum!" }).min(1, "Jelszó megadása szükséges!").min(8, "A jelszónak legalább 8 karakter hosszúnak kell lennie!")
});

export const actions: Actions = {
    async default({ request }) {
        const formData = Object.fromEntries(await request.formData());

        const result = loginPageSchema.safeParse(formData);

        if (!result.success) {
            const { fieldErrors: errors } = result.error.flatten();
            const { email } = formData;

            return fail(400, { data: { email }, errors });
        } else {
            const { email, password } = result.data;

            // TODO: login logic

            throw redirect(301, "/");
        }
    }
} 