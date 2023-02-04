import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import * as env from "$env/static/private";
import SessionIssuer from "$lib/server/auth/session-issuer";
import { PrismaClient } from "@prisma/client";
import initDb from "$lib/server/init-db";
import { hash } from "$lib/server/auth/hashing";

const db = new PrismaClient();
db.$connect()
    .then(async () => await initDb(db as Omit<typeof db, `$${string}`>, {
        role: {
            data: [
                { name: "Admin", permissions: ["register", "view-results", "view-user-votes", "revert-finalizations"] },
                { name: "DÖMST", permissions: ["view-results", "view-user-votes", "revert-finalizations"] },
                { name: "DÖK", permissions: ["view-results"] },
                { name: "Zsűri", permissions: ["vote"] },
            ]
        },
        orderCategory: {
            data: [
                { name: "Előadásmód" },
                { name: "Díszlet" },
                { name: "Információ" },
                { name: "Tánc" },
                { name: "Humor" }
            ]
        },
        class: {
            data: [
                { name: "9.A", country: "Brazília" },
                { name: "10.B", country: "Franciaország" },
                { name: "10.C", country: "Szerbia" },
                { name: "10.D", country: "Malajzia" },
                { name: "9.E", country: "Marokkó" },
                { name: "9.F", country: "Mongólia" }
            ]
        }
    }))
    .then(async () => await initDb(db as Omit<typeof db, `$${string}`>, {
        user: {
            data: [
                {
                    email: "admin@szlgbp.hu",
                    name: "admin",
                    password: hash(env.DEFAULT_ADMIN_PASSWORD),
                    roleId: (await db.role.findUniqueOrThrow({ where: { name: "Admin" } })).id
                }
            ]
        }
    }));

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

    const revokedTokenRecord = await db.revokedToken.findUnique({ where: { value: token } });
    if (revokedTokenRecord) {
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
