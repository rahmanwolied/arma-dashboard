"use server";

import { eq, inArray } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { revalidateTag, unstable_noStore } from "next/cache";
import { db } from "@/db/index";
import { takeFirstOrThrow } from "@/db/utils";
import { animals, cattle, weightRecords } from "@/db/schema";
import type { Cattle } from "@/db/schema";
import { getErrorMessage } from "@/lib/handle-error";
import { auth } from "@clerk/nextjs/server";
import { hasPermission } from "@/permissions";

import type { CreateCattleSchema, UpdateCattleSchema } from "../validations";

// Helper function to generate random cattle data for replacements
function generateRandomCattle(): Omit<typeof cattle.$inferInsert, "animalId"> {
    const nanoid = customAlphabet("0123456789", 6);
    const genders = ["MALE", "FEMALE"] as const;
    const healthStatuses = ["HEALTHY", "MINOR_ISSUE", "SICK"] as const;

    return {
        tagNumber: `TAG-${nanoid()}`,
        gender: genders[Math.floor(Math.random() * genders.length)],
        healthStatus:
            healthStatuses[Math.floor(Math.random() * healthStatuses.length)],
        isQuarantined: Math.random() < 0.1,
        isPregnant: Math.random() < 0.3,
        isLactating: Math.random() < 0.2,
        createdAt: new Date(),
        createdBy: "system",
    };
}

export async function createCattle(input: CreateCattleSchema) {
    unstable_noStore();

    const { userId, sessionClaims } = await auth();

    if (!userId) {
        return {
            data: null,
            error: "Unauthorized",
        };
    }

    if (!hasPermission(sessionClaims?.role, "write:cattle")) {
        return {
            data: null,
            error: "Unauthorized",
        };
    }

    try {
        await db.transaction(async (tx) => {
            // Create animal first
            const newAnimal = await tx
                .insert(animals)
                .values({
                    animalType: "CATTLE",
                    status: "ON_FARM",
                    createdBy: userId,
                })
                .returning({ id: animals.id })
                .then(takeFirstOrThrow);

            // Create cattle record
            await tx
                .insert(cattle)
                .values({
                    animalId: newAnimal.id,
                    tagNumber: input.tagNumber,
                    gender: input.gender,
                    healthStatus: input.healthStatus || "HEALTHY",
                    isQuarantined: input.isQuarantined || false,
                    isPregnant: input.isPregnant || false,
                    isLactating: input.isLactating || false,
                    createdBy: userId,
                });

            // Note: Purchase records require a purchase_id reference
            // This would need to be implemented with a proper purchase workflow

            // Create initial weight record
            if (input.liveWeight) {
                await tx
                    .insert(weightRecords)
                    .values({
                        animalId: newAnimal.id,
                        weightKg: input.liveWeight,
                        recordedAt: new Date(),
                        recordedBy: userId,
                        notes: "Initial weight record",
                    });
            }
        });

        revalidateTag("cattle");
        revalidateTag("cattle-stats");

        return {
            data: null,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            error: getErrorMessage(err),
        };
    }
}

export async function updateCattle(input: UpdateCattleSchema) {
    unstable_noStore();

    const { userId, sessionClaims } = await auth();

    if (!userId) {
        return {
            data: null,
            error: "Unauthorized",
        };
    }

    if (!hasPermission(sessionClaims?.role, "update:cattle")) {
        return {
            data: null,
            error: "Unauthorized",
        };
    }

    try {
        const { id, ...updateData } = input;

        const data = await db
            .update(cattle)
            .set({
                ...updateData,
                updatedAt: new Date(),
                updatedBy: userId,
            })
            .where(eq(cattle.animalId, id))
            .returning({
                animalId: cattle.animalId,
                healthStatus: cattle.healthStatus,
            })
            .then(takeFirstOrThrow);

        revalidateTag("cattle");
        if (data.healthStatus === input.healthStatus) {
            revalidateTag("cattle-health-stats");
        }

        return {
            data: null,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            error: getErrorMessage(err),
        };
    }
}

export async function updateCattles(input: {
    ids: string[];
    healthStatus?: Cattle["healthStatus"];
    isQuarantined?: boolean;
    isPregnant?: boolean;
    isLactating?: boolean;
}) {
    unstable_noStore();

    const { userId, sessionClaims } = await auth();

    if (!userId) {
        return {
            data: null,
            error: "Unauthorized",
        };
    }

    if (!hasPermission(sessionClaims?.role, "update:cattle")) {
        return {
            data: null,
            error: "Unauthorized",
        };
    }

    try {
        const { ids, ...updateData } = input;

        await db
            .update(cattle)
            .set({
                ...updateData,
                updatedAt: new Date(),
                updatedBy: userId,
            })
            .where(inArray(cattle.animalId, ids));

        revalidateTag("cattle");
        revalidateTag("cattle-health-stats");

        return {
            data: null,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            error: getErrorMessage(err),
        };
    }
}

export async function deleteCattle(input: { id: string }) {
    unstable_noStore();

    const { userId, sessionClaims } = await auth();

    if (!userId) {
        return {
            data: null,
            error: "Unauthorized",
        };
    }

    if (!hasPermission(sessionClaims?.role, "delete:cattle")) {
        return {
            data: null,
            error: "Unauthorized",
        };
    }

    try {
        await db.transaction(async (tx) => {
            // Delete the animal (cascade will handle cattle and related records)
            await tx.delete(animals).where(eq(animals.id, input.id));

            // Create a new random cattle to replace the deleted one
            const randomCattleData = generateRandomCattle();

            const newAnimal = await tx
                .insert(animals)
                .values({
                    animalType: "CATTLE",
                    status: "ON_FARM",
                    createdBy: userId,
                })
                .returning({ id: animals.id })
                .then(takeFirstOrThrow);

            await tx.insert(cattle).values({
                ...randomCattleData,
                animalId: newAnimal.id,
                createdBy: userId,
            });
        });

        revalidateTag("cattle");
        revalidateTag("cattle-stats");
        revalidateTag("cattle-health-stats");

        return {
            data: null,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            error: getErrorMessage(err),
        };
    }
}

export async function deleteCattles(input: { ids: string[] }) {
    unstable_noStore();

    const { userId, sessionClaims } = await auth();

    if (!userId) {
        return {
            data: null,
            error: "Unauthorized",
        };
    }

    if (!hasPermission(sessionClaims?.role, "delete:cattle")) {
        return {
            data: null,
            error: "Unauthorized",
        };
    }

    try {
        await db.transaction(async (tx) => {
            // Delete the animals (cascade will handle cattle and related records)
            await tx.delete(animals).where(inArray(animals.id, input.ids));

            // Create new random cattle to replace the deleted ones
            for (let i = 0; i < input.ids.length; i++) {
                const randomCattleData = generateRandomCattle();

                const newAnimal = await tx
                    .insert(animals)
                    .values({
                        animalType: "CATTLE",
                        status: "ON_FARM",
                        createdBy: userId,
                    })
                    .returning({ id: animals.id })
                    .then(takeFirstOrThrow);

                await tx.insert(cattle).values({
                    ...randomCattleData,
                    animalId: newAnimal.id,
                    createdBy: userId,
                });
            }
        });

        revalidateTag("cattle");
        revalidateTag("cattle-stats");
        revalidateTag("cattle-health-stats");

        return {
            data: null,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            error: getErrorMessage(err),
        };
    }
}
