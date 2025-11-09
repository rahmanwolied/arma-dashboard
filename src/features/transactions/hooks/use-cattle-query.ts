import { useQuery } from "@tanstack/react-query";
import { getAvailableCattle } from "@/features/cattle/actions";

/**
 * Custom hook for querying available cattle for sale
 *
 * @param searchTag - Optional tag number to filter cattle
 * @returns React Query result with available cattle data
 */
export function useCattleQuery(searchTag?: string) {
	return useQuery({
		queryKey: ["available-cattle", searchTag],
		queryFn: () => getAvailableCattle(searchTag),
		enabled: true,
		staleTime: 1000 * 60, // 1 minute
	});
}

export default useCattleQuery;
