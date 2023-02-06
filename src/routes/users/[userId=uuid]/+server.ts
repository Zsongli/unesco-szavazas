import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import z from "zod";

const editUserSchema = z.object({
    name: z.string({ required_error: "Teljes név megadása szükséges!", invalid_type_error: "Hibás teljes név formátum!" }).trim().min(1, "Teljes név megadása szükséges!").refine(name => name.split(" ").length >= 2, "A teljes név legalább egy vezetéknévből és egy keresztnévből áll!"),
    email: z.string({ required_error: "E-mail cím megadása szükséges!", invalid_type_error: "Hibás e-mail cím formátum!" }).trim().min(1, "E-mail cím megadása szükséges!").email("Hibás e-mail cím formátum!").endsWith("@szlgbp.hu", "Csak lászlós e-mail címek használhatóak!"),
    roleId: z.number({ required_error: "Szerepkörazonosító megadása szükséges!", invalid_type_error: "Hibás szerepkörazonosító formátum!" }).int("A szerepkör azonosítója természetes szám kell legyen!").positive("A szerepkör azonosítója természetes szám kell legyen!")
});
export const PUT = (async ({ request, locals, params }) => {
    if (!locals.session) throw error(401);
    if (!locals.session.user.role.permissions.includes("manage-users")) throw error(403);

    const { userId } = params;

    const user = await locals.db.user.findUnique({ where: { id: userId } });
    if (!user) throw error(404);

    const result = editUserSchema.safeParse(await request.json().catch(() => { }));
    if (!result.success) throw error(400, Object.values(result.error.flatten().fieldErrors)[0]?.[0] ?? "Érvénytelen adatok!");
    const { name, email, roleId } = result.data;

    await locals.db.user.update({ where: { id: userId }, data: { name, email, roleId } });
    return json({ message: "Sikeres módosítás." });

}) satisfies RequestHandler;

export const DELETE = (async ({ locals, params }) => {
    if(!locals.session) throw error(401);
    if(!locals.session.user.role.permissions.includes("manage-users")) throw error(403);

    const { userId } = params;
    const user = await locals.db.user.findUnique({ where: { id: userId } });
    if(!user) throw error(404);

    // no promise.all, needs to happen in order
    await locals.db.orderFinalized.deleteMany({ where: { userId } });
    await locals.db.placement.deleteMany({ where: { userId } });
    await locals.db.user.delete({ where: { id: userId } });

    return json({ message: "Sikeres törlés." });

}) satisfies RequestHandler;