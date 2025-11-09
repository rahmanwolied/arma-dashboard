/**
 * Hook for fetching markets data
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import type { Market } from "@/db/schema";
import { getMarkets } from "../../actions/market-actions";

interface MarketsResponse {
    markets: Market[];
}

async function fetchMarkets(): Promise<MarketsResponse> {
    const result = await getMarkets();
    if (!result.success) {
        console.error("Failed to fetch markets:", result.message);
        return {
            markets: [],
        };
    }

    return {
        markets: result.markets,
    };
}

export function useMarketsQuery() {
    return useQuery({
        queryKey: ["markets"],
        queryFn: fetchMarkets,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

