import { NextResponse } from "next/server";
import { getAllDistricts } from "@/app/_lib/queries/divisions";

export async function GET() {
    try {
        const districts = await getAllDistricts();
        return NextResponse.json({ districts });
    } catch (error) {
        console.error("Error fetching districts:", error);
        return NextResponse.json(
            { error: "Failed to fetch districts" },
            { status: 500 }
        );
    }
}

