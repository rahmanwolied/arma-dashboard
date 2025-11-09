import { useQuery } from "@tanstack/react-query";

// ============================================================================
// Types
// ============================================================================

export interface Division {
    id: string;
    name: string;
    code: string;
    nameBengali?: string;
}

export interface District {
    id: string;
    name: string;
    code: string;
    divisionId: string;
    nameBengali?: string;
}

export interface Zone {
    id: string;
    name: string;
    code: string;
    districtId: string;
    nameBengali?: string;
    postCode?: string;
}

// ============================================================================
// API Functions
// ============================================================================

async function fetchDivisions(): Promise<Division[]> {
    const response = await fetch("/api/locations/divisions");
    if (!response.ok) {
        throw new Error("Failed to fetch divisions");
    }
    const data = await response.json();
    return data.divisions || [];
}

async function fetchDistricts(): Promise<District[]> {
    const response = await fetch("/api/locations/districts");
    if (!response.ok) {
        throw new Error("Failed to fetch districts");
    }
    const data = await response.json();
    return data.districts || [];
}

async function fetchZones(): Promise<Zone[]> {
    const response = await fetch("/api/locations/zones");
    if (!response.ok) {
        throw new Error("Failed to fetch zones");
    }
    const data = await response.json();
    return data.zones || [];
}

// ============================================================================
// Custom Hooks
// ============================================================================

export function useDivisions() {
    return useQuery({
        queryKey: ["divisions"],
        queryFn: fetchDivisions,
        staleTime: 1000 * 60 * 60, // 1 hour - divisions rarely change
    });
}

export function useDistricts() {
    return useQuery({
        queryKey: ["districts"],
        queryFn: fetchDistricts,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useZones() {
    return useQuery({
        queryKey: ["zones"],
        queryFn: fetchZones,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

