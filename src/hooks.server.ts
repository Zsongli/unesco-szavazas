import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import * as env from "$env/static/private";
import SessionIssuer from "$lib/server/auth/session-issuer";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
db.$connect().then(async () => {

    if (await db.role.count() === 0) {
        await db.role.create({ data: { name: "Default", permissions: ["vote", "register", "view-results"] } });
    }

    if (await db.orderCategory.count() === 0) {
        await db.orderCategory.createMany({
            data: [
                { name: "Előadásmód" },
                { name: "Díszlet" },
                { name: "Információ" },
                { name: "Tánc" },
                { name: "Humor" }
            ]
        });

    }

    if (await db.class.count() === 0) {
        await db.class.createMany({
            data: [
                { name: "9.A", country: "Kiribati" },
                { name: "10.B", country: "Pakisztán" },
                { name: "10.C", country: "Chile" },
                { name: "10.D", country: "Montenegro" },
                { name: "9.E", country: "Zimbabwe" },
                { name: "9.F", country: "Belize" }
            ]
        });
    }

});

const sessionIssuer = new SessionIssuer<App.Session>(env.JWT_SECRET);

const populateLocals: Handle = async ({ event, resolve }) => {
    event.locals.sessionIssuer = sessionIssuer;
    event.locals.db = db;
    return await resolve(event);
};

const auth: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get("session_token");
    if (!token) return await resolve(event);

    const session = sessionIssuer.decode(token);
    if (!session) return await resolve(event);

    if (await db.revokedToken.findFirst({ where: { value: token } })) {
        event.cookies.delete("session_token");
        return await resolve(event);
    }

    event.locals.session = session;
    return await resolve(event);
};

const log: Handle = async ({ event, resolve }) => {
    const start = Date.now();
    const response = await resolve(event);
    const end = Date.now();
    console.info(`<${new Date(end).toLocaleString()}> ${event.request.method} ${new URL(event.request.url).pathname} -> ${response.status} ${response.ok ? "OK" : "ERROR"} (${end - start}ms)`);
    return response;
};

export const handle: Handle = sequence(populateLocals, auth, log);
