import type { PrismaClient } from "@prisma/client";
import { error } from "@sveltejs/kit";
import z from 'zod'

export function assertVoterSession(session: App.Session | undefined): asserts session is App.Session {
    if (!session) throw error(401);
    if (!session.user.role.permissions.includes('vote')) throw error(403);
}

export async function getCategoryOrThrow(db: PrismaClient, categoryId: number) {
    const categoryRecord = await db.orderCategory.findUnique({ where: { id: categoryId } });
    if (!categoryRecord) throw error(404, "Category not found");
    return categoryRecord;
}

export async function isFinalized(db: PrismaClient, judgeId: string, categoryId: number) {
    const finalizedRecord = await db.orderFinalized.findUnique({ where: { userId_categoryId: { categoryId: categoryId, userId: judgeId } } });
    return !!finalizedRecord
}

export async function assertNotFinalized(db: PrismaClient, judgeId: string, categoryId: number) {
    if (await isFinalized(db, judgeId, categoryId)) throw error(400, "Already finalized this category");
}

export async function finalize(db: PrismaClient, judgeId: string, categoryId: number) {
    await db.orderFinalized.create({ data: { categoryId: categoryId, userId: judgeId } });
}


export async function parseAndValidateOrderingFromRequestOrThrow(request: Request, db: PrismaClient) {
    const classIdsOrdered = await parseOrderingFromRequestOrThrow(request);
    await validateOrderingOrThrow(classIdsOrdered, db)
    return classIdsOrdered;
}

const schema = z.array(z.number().int());
export async function parseOrderingFromRequestOrThrow(request: Request) {
    const dirtyData = await request.json().catch(() => ({}));
    const parseResult = schema.safeParse(dirtyData);
    if (!parseResult.success) throw error(400, "Invalid format");
    const classIdsOrdered = parseResult.data;
    return classIdsOrdered;
}

export async function validateOrderingOrThrow(classIdsOrdered: number[], db: PrismaClient) {
    const orderClassIdSet = new Set(classIdsOrdered);
    if (orderClassIdSet.size !== classIdsOrdered.length) throw error(400, "Found duplicate classes");

    const classRecords = await db.class.findMany();
    if (classIdsOrdered.length != classRecords.length) throw error(400, "Invalid number of classes");

    if (!classRecords.every(x => orderClassIdSet.has(x.id))) throw error(400, "Couldn't find a class in the ordering");
}

export async function upsertClass(db: PrismaClient, judgeId: string, categoryId: number, classId: number, placement: number) {
    await db.placement.upsert({
        where: { userId_categoryId_classId: { categoryId: categoryId, classId: classId, userId: judgeId } },
        update: { placement: placement },
        create: { categoryId: categoryId, classId: classId, userId: judgeId, placement: placement }
    });
}