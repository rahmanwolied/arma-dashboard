import { useQuery } from "@tanstack/react-query";
import { getAvailableCattle } from "@/features/cattle/actions";

export default function useCattleQuery(searchTag?: string) {
    return useQuery({
        queryKey: ["available-cattle", searchTag],
        queryFn: () => getAvailableCattle(searchTag),
        enabled: true,
    });
}

