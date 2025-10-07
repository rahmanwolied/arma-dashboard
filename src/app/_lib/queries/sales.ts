import "server-only";

import {
    and,
    asc,
    count,
    desc,
    gte,
    ilike,
    inArray,
    lte,
    sql,
} from "drizzle-orm";
import { db } from "@/db";
import { customers, sales } from "@/db/schema";

import { filterColumns } from "@/lib/filter-columns";
import { unstable_cache } from "@/lib/unstable-cache";

import type { GetSalesSchema } from "../validations";

export async function getSalesData(input: GetSalesSchema) {
    return await unstable_cache(
        async () => {
            try {
                const offset = (input.page - 1) * input.perPage;
                const advancedTable = input.filterFlag === "advancedFilters" ||
                    input.filterFlag === "commandFilters";

                const advancedWhere = filterColumns({
                    table: sales,
                    filters: input.filters,
                    joinOperator: input.joinOperator,
                });

                const where = advancedTable ? advancedWhere : and(
                    input.search
                        ? ilike(customers.name, `%${input.search}%`)
                        : undefined,
                    input.discountType.length > 0
                        ? inArray(sales.discountType, input.discountType)
                        : undefined,
                    input.saleDate.length > 0
                        ? and(
                            input.saleDate[0]
                                ? gte(
                                    sales.saleDate,
                                    (() => {
                                        const date = new Date(
                                            input.saleDate[0],
                                        );
                                        date.setHours(0, 0, 0, 0);
                                        return date;
                                    })(),
                                )
                                : undefined,
                            input.saleDate[1]
                                ? lte(
                                    sales.saleDate,
                                    (() => {
                                        const date = new Date(
                                            input.saleDate[1],
                                        );
                                        date.setHours(23, 59, 59, 999);
                                        return date;
                                    })(),
                                )
                                : undefined,
                        )
                        : undefined,
                );

                const orderBy = input.sort.length > 0
                    ? input.sort.map((item) =>
                        item.desc
                            ? desc(
                                sales[
                                    item.id as keyof typeof sales.$inferSelect
                                ],
                            )
                            : asc(
                                sales[
                                    item.id as keyof typeof sales.$inferSelect
                                ],
                            )
                    )
                    : [desc(sales.createdAt)];

                const { data, total } = await db.transaction(async (tx) => {
                    // Get sales with customer info
                    const data = await tx
                        .select({
                            id: sales.id,
                            farmId: sales.farmId,
                            customerId: sales.customerId,
                            customerName: customers.name,
                            customerPhone: customers.primaryPhone,
                            invoiceNumber: sales.invoiceNumber,
                            totalAmount: sales.totalAmount,
                            discountAmount: sales.discountAmount,
                            discountType: sales.discountType,
                            amountPaid: sales.amountPaid,
                            amountDue: sales.amountDue,
                            isCredit: sales.isCredit,
                            paymentTerms: sales.paymentTerms,
                            saleDate: sales.saleDate,
                            createdAt: sales.createdAt,
                            updatedAt: sales.updatedAt,
                        })
                        .from(sales)
                        .leftJoin(
                            customers,
                            sql`${customers.id} = ${sales.customerId}`,
                        )
                        .limit(input.perPage)
                        .offset(offset)
                        .where(where)
                        .orderBy(...orderBy);

                    const total = await tx
                        .select({
                            count: count(),
                        })
                        .from(sales)
                        .leftJoin(
                            customers,
                            sql`${customers.id} = ${sales.customerId}`,
                        )
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
            } catch (_err) {
                return { data: [], pageCount: 0 };
            }
        },
        [JSON.stringify(input)],
        {
            revalidate: 1,
            tags: ["sales"],
        },
    )();
}

export type SaleWithCustomer = Awaited<
    ReturnType<typeof getSalesData>
>["data"][number];
