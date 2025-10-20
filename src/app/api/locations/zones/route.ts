import { NextResponse } from "next/server";
import { db } from "@/db";
import { zones } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
    try {
        const zonesData = await db
            .select({
                id: zones.id,
                code: zones.code,
                name: zones.name,
                nameBengali: zones.nameBengali,
                districtId: zones.districtId,
                postCode: zones.postCode,
            })
            .from(zones)
            .orderBy(asc(zones.name));

        return NextResponse.json({ zones: zonesData });
    } catch (error) {
        console.error("Error fetching zones:", error);
        return NextResponse.json(
            { error: "Failed to fetch zones" },
            { status: 500 }
        );
    }
}

