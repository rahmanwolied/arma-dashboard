import "server-only";

import { and, asc, count, desc, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { addresses, customers, districts, divisions, zones } from "@/db/schema";

import { filterColumns } from "@/lib/filters";
import { unstable_cache } from "@/lib/unstable-cache";

import type { GetCustomersSchema } from "../validations";

export async function getCustomersData(input: GetCustomersSchema) {
    return await unstable_cache(
        async () => {
            try {
                const offset = (input.page - 1) * input.perPage;
                const advancedTable = input.filterFlag === "advancedFilters" ||
                    input.filterFlag === "commandFilters";

                const advancedWhere = filterColumns({
                    table: customers,
                    filters: input.filters,
                    joinOperator: input.joinOperator,
                });

                const where = advancedTable ? advancedWhere : and(
                    input.search
                        ? ilike(customers.name, `%${input.search}%`)
                        : undefined,
                );

                const orderBy = input.sort.length > 0
                    ? input.sort.map((item) =>
                        item.desc
                            ? desc(
                                customers[
                                    item.id as keyof typeof customers.$inferSelect
                                ],
                            )
                            : asc(
                                customers[
                                    item.id as keyof typeof customers.$inferSelect
                                ],
                            )
                    )
                    : [desc(customers.createdAt)];

                const { data, total } = await db.transaction(async (tx) => {
                    // Get customers with their primary address
                    const data = await tx
                        .select({
                            id: customers.id,
                            name: customers.name,
                            primaryPhone: customers.primaryPhone,
                            secondaryPhone: customers.secondaryPhone,
                            email: customers.email,
                            createdAt: customers.createdAt,
                            updatedAt: customers.updatedAt,
                            deletedAt: customers.deletedAt,
                            // Address info
                            addressId: addresses.id,
                            addressLine: addresses.addressLine,
                            landmark: addresses.landmark,
                            divisionName: divisions.name,
                            districtName: districts.name,
                            zoneName: zones.name,
                        })
                        .from(customers)
                        .leftJoin(
                            addresses,
                            sql`${addresses.customerId} = ${customers.id}`,
                        )
                        .leftJoin(
                            divisions,
                            sql`${divisions.id} = ${addresses.divisionId}`,
                        )
                        .leftJoin(
                            districts,
                            sql`${districts.id} = ${addresses.districtId}`,
                        )
                        .leftJoin(zones, sql`${zones.id} = ${addresses.zoneId}`)
                        .limit(input.perPage)
                        .offset(offset)
                        .where(where)
                        .orderBy(...orderBy);

                    const total = await tx
                        .select({
                            count: count(),
                        })
                        .from(customers)
                        .where(where)
                        .execute()
                        .then((res) => res[0]?.count ?? 0);

                    return {
                        data,
                        total,
                    };
                });

                const pageCount = Math.ceil(total / input.perPage);
                return { data, pageCount };
            } catch (err) {
                console.error("Error fetching customers:", err);
                return { data: [], pageCount: 0 };
            }
        },
        [JSON.stringify(input)],
        {
            revalidate: 1,
            tags: ["customers"],
        },
    )();
}

export type CustomerWithAddress = Awaited<
    ReturnType<typeof getCustomersData>
>["data"][number];
