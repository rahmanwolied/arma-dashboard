import { useQuery } from "@tanstack/react-query";
import { getSaleByIdAction } from "../actions/get-sale";
import type { UseSaleQueryOptions } from "../types";

/**
 * Custom hook for fetching sale data by ID
 *
 * @param options - Query options including saleId and enabled flag
 * @returns React Query result with sale data
 */
export function useSaleQuery(options: UseSaleQueryOptions) {
	const { saleId, enabled = true } = options;

	return useQuery({
		queryKey: ["sale", saleId],
		queryFn: async () => {
			const result = await getSaleByIdAction(saleId);

			if (!result.success) {
				throw new Error(result.message);
			}

			return result.data;
		},
		enabled: enabled && !!saleId,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
}
