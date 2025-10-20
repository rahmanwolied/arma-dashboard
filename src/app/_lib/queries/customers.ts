import "server-only";

import { CustomerQueryService } from "@/services/CustomerServices";
import type { GetCustomersSchema } from "../validations";

const customerQueryService = new CustomerQueryService();

export async function getCustomersData(input: GetCustomersSchema) {
    const result = await customerQueryService.getCustomersData(input);

    // Transform to match the expected return type
    return {
        data: result.data,
        pageCount: result.pageCount,
    };
}

export type CustomerWithAddress = Awaited<
    ReturnType<typeof getCustomersData>
>["data"][number];
