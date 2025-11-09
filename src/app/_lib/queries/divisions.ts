import "server-only";

import { db } from "@/db";
import { divisions, districts, zones } from "@/db/schema";
import { unstable_cache } from "@/lib/unstable-cache";
import { asc, eq } from "drizzle-orm";

/**
 * Get all divisions for filter options
 */
export async function getAllDivisions() {
    try {
        const data = await db
            .select({
                id: divisions.id,
                code: divisions.code,
                name: divisions.name,
                nameBengali: divisions.nameBengali,
            })
            .from(divisions)
            .orderBy(asc(divisions.name));

        return data;
    } catch (err) {
        console.error("Error fetching divisions:", err);
        return [];
    }
}

export async function getAllZones() {
    try {
        const data = await db.select({
            id: zones.id,
            name: zones.name,
            nameBengali: zones.nameBengali
        }).from(zones).orderBy(asc(zones.name))
        return data;
    } catch (err) {
        console.error("Error fetching zones:", err);
        return [];
    }
}

/**
 * Get all districts for filter options
 */
export async function getAllDistricts() {
    try {
        const data = await db
            .select({
                id: districts.id,
                code: districts.code,
                name: districts.name,
                nameBengali: districts.nameBengali,
                divisionId: districts.divisionId,
            })
            .from(districts)
            .orderBy(asc(districts.name));

        return data;
    } catch (err) {
        console.error("Error fetching districts:", err);
        return [];
    }
}

/**
 * Get division and district options formatted for filters
 */
export async function getDivisionDistrictOptions() {
    const [divisionsData, districtsData] = await Promise.all([
        getAllDivisions(),
        getAllDistricts(),
    ]);

    const divisionOptions = divisionsData.map((div) => ({
        value: div.id,
        label: div.name,
    }));

    const districtOptions = districtsData.map((dist) => ({
        value: dist.id,
        label: dist.name,
    }));

    return {
        divisions: divisionOptions,
        districts: districtOptions,
    };
}

export type Division = Awaited<ReturnType<typeof getAllDivisions>>[number];
export type District = Awaited<ReturnType<typeof getAllDistricts>>[number];

