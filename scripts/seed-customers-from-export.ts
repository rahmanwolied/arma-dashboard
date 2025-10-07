import * as fs from "node:fs";
import { db } from "./db";
import {
    addresses,
    customers,
    districts,
    divisions,
    zones,
} from "../src/db/schema";

interface ExportCustomer {
    id: string;
    name: string;
    address: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
}

interface ExportData {
    exportTimestamp: string;
    summary: {
        totalCustomers: number;
    };
    data: {
        customers: ExportCustomer[];
    };
}

interface NormalizedAddress {
    phone: string;
    normalized: {
        division: string | null;
        district: string | null;
        zone: string | null;
        addressLine: string;
        confidence: number;
        notes: string;
    };
}

// Location lookup maps for normalization
const locationData = JSON.parse(
    fs.readFileSync("./scripts/locations.json", "utf-8"),
);

class CustomerSeeder {
    private customerMap = new Map<string, string>(); // phone -> customerId
    private divisionMap = new Map<string, string>(); // name -> divisionId
    private districtMap = new Map<string, string>(); // name -> districtId
    private zoneMap = new Map<string, string>(); // name -> zoneId
    private normalizedAddressMap = new Map<
        string,
        NormalizedAddress["normalized"]
    >(); // phone -> normalized address

    async loadNormalizedAddresses(normalizedPath: string) {
        console.log("📍 Loading LLM-normalized addresses...");

        if (!fs.existsSync(normalizedPath)) {
            console.warn(
                `⚠️  Normalized addresses file not found: ${normalizedPath}`,
            );
            console.warn("⚠️  Falling back to heuristic address parsing...");
            return;
        }

        try {
            const rawData = fs.readFileSync(normalizedPath, "utf-8");
            const normalizedData: NormalizedAddress[] = JSON.parse(rawData);

            for (const item of normalizedData) {
                this.normalizedAddressMap.set(item.phone, item.normalized);
            }

            console.log(
                `✅ Loaded ${normalizedData.length} normalized addresses from LLM`,
            );
        } catch (err) {
            console.error("❌ Error loading normalized addresses:", err);
            console.warn("⚠️  Falling back to heuristic address parsing...");
        }
    }

    async loadGeographicalData() {
        console.log("📍 Loading geographical data...");

        // Load existing divisions, districts, zones from DB
        const existingDivisions = await db.select().from(divisions);
        const existingDistricts = await db.select().from(districts);
        const existingZones = await db.select().from(zones);

        for (const div of existingDivisions) {
            this.divisionMap.set(div.name.toLowerCase(), div.id);
        }
        for (const dist of existingDistricts) {
            this.districtMap.set(dist.name.toLowerCase(), dist.id);
        }
        for (const zone of existingZones) {
            this.zoneMap.set(zone.name.toLowerCase(), zone.id);
        }

        console.log(
            `✅ Loaded ${existingDivisions.length} divisions, ${existingDistricts.length} districts, ${existingZones.length} zones`,
        );
    }

    /**
     * Get normalized address from LLM data or fall back to heuristic parsing
     * @param phone Customer phone number (key for LLM normalized data)
     * @param addressString Original address string from export
     * @returns Normalized address components
     */
    getAddress(
        phone: string,
        addressString: string,
    ): {
        divisionName: string | null;
        districtName: string | null;
        zoneName: string | null;
        addressLine: string;
        confidence?: number;
        notes?: string;
    } {
        // First try to get LLM-normalized address
        const normalized = this.normalizedAddressMap.get(phone);
        if (normalized) {
            return {
                divisionName: normalized.division,
                districtName: normalized.district,
                zoneName: normalized.zone,
                addressLine: normalized.addressLine,
                confidence: normalized.confidence,
                notes: normalized.notes,
            };
        }

        // Fallback to heuristic parsing
        return this.parseAddressHeuristic(addressString);
    }

    /**
     * Heuristic-based address parsing (fallback method)
     * Try to extract division, district, zone from address string
     */
    private parseAddressHeuristic(addressString: string): {
        divisionName: string | null;
        districtName: string | null;
        zoneName: string | null;
        addressLine: string;
    } {
        const lowerAddress = addressString.toLowerCase();

        let divisionName: string | null = null;
        let districtName: string | null = null;
        let zoneName: string | null = null;

        // Check for "Dhaka" as it's common
        if (lowerAddress.includes("dhaka")) {
            divisionName = "Dhaka";
            districtName = "Dhaka";

            // Try to find zone/thana from locations data
            for (const region of locationData) {
                if (region.name.toLowerCase().includes("dhaka")) {
                    for (const zone of region.zones || []) {
                        if (lowerAddress.includes(zone.name.toLowerCase())) {
                            zoneName = zone.name;
                            break;
                        }
                    }
                }
            }
        }

        // If we couldn't determine zone, try common zones in the address
        if (!zoneName) {
            for (const region of locationData) {
                for (const zone of region.zones || []) {
                    if (lowerAddress.includes(zone.name.toLowerCase())) {
                        zoneName = zone.name;
                        // Try to get parent division
                        if (region.name) {
                            divisionName = region.name.split(" - ")[0]; // "Dhaka - North" -> "Dhaka"
                        }
                        break;
                    }
                }
                if (zoneName) break;
            }
        }

        return {
            divisionName,
            districtName,
            zoneName,
            addressLine:
                addressString.split(",").slice(0, 2).join(",").trim() ||
                addressString,
        };
    }

    async seedCustomers(filePath: string, normalizedPath?: string) {
        console.log("🌱 Starting customer seeding from export...");

        // Read export data
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const rawData = fs.readFileSync(filePath, "utf-8");
        const exportData: ExportData = JSON.parse(rawData);

        console.log(
            `📊 Found ${exportData.data.customers.length} customers to seed`,
        );

        // Load LLM-normalized addresses if provided
        if (normalizedPath) {
            await this.loadNormalizedAddresses(normalizedPath);
        }

        await this.loadGeographicalData();

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;
        let lowConfidenceCount = 0;

        // Get or create a default division/district/zone for fallback
        let defaultDivisionId = this.divisionMap.get("dhaka");
        let defaultDistrictId = this.districtMap.get("dhaka");
        let defaultZoneId = Array.from(this.zoneMap.values())[0]; // First zone as fallback

        if (!defaultDivisionId || !defaultDistrictId || !defaultZoneId) {
            console.warn(
                "⚠️  Default geographical data not found. Creating defaults...",
            );

            // Create default division
            const [defaultDivision] = await db
                .insert(divisions)
                .values({
                    code: "DH",
                    name: "Dhaka",
                    nameBengali: "ঢাকা",
                })
                .onConflictDoNothing()
                .returning();
            defaultDivisionId = defaultDivision?.id || defaultDivisionId;

            // Create default district
            if (defaultDivisionId) {
                const [defaultDistrict] = await db
                    .insert(districts)
                    .values({
                        code: "DH-01",
                        divisionId: defaultDivisionId,
                        name: "Dhaka",
                        nameBengali: "ঢাকা",
                    })
                    .onConflictDoNothing()
                    .returning();
                defaultDistrictId = defaultDistrict?.id || defaultDistrictId;
            }

            // Create default zone
            if (defaultDistrictId) {
                const [defaultZone] = await db
                    .insert(zones)
                    .values({
                        code: "DH-01-01",
                        districtId: defaultDistrictId,
                        name: "Dhaka Central",
                        nameBengali: "ঢাকা কেন্দ্রীয়",
                    })
                    .onConflictDoNothing()
                    .returning();
                defaultZoneId = defaultZone?.id || defaultZoneId;
            }
        }

        for (const exportCustomer of exportData.data.customers) {
            try {
                // Skip if already processed (by phone)
                if (this.customerMap.has(exportCustomer.phone)) {
                    skipCount++;
                    continue;
                }

                // Create customer
                const [customer] = await db
                    .insert(customers)
                    .values({
                        name: exportCustomer.name,
                        primaryPhone: exportCustomer.phone,
                        createdAt: new Date(exportCustomer.createdAt),
                        updatedAt: new Date(exportCustomer.updatedAt),
                    })
                    .returning();

                this.customerMap.set(exportCustomer.phone, customer.id);

                // Get address (from LLM normalization or heuristic fallback)
                const addressData = this.getAddress(
                    exportCustomer.phone,
                    exportCustomer.address,
                );

                // Track low confidence normalizations
                if (
                    addressData.confidence !== undefined &&
                    addressData.confidence < 0.7
                ) {
                    lowConfidenceCount++;
                    console.warn(
                        `⚠️  Low confidence (${
                            addressData.confidence.toFixed(2)
                        }) for ${exportCustomer.name}: ${
                            addressData.notes || "N/A"
                        }`,
                    );
                }

                // Get or use default IDs
                const divisionId = (addressData.divisionName &&
                    this.divisionMap.get(
                        addressData.divisionName.toLowerCase(),
                    )) ||
                    defaultDivisionId;
                const districtId = (addressData.districtName &&
                    this.districtMap.get(
                        addressData.districtName.toLowerCase(),
                    )) ||
                    defaultDistrictId;
                const zoneId = (addressData.zoneName &&
                    this.zoneMap.get(addressData.zoneName.toLowerCase())) ||
                    defaultZoneId;

                if (!divisionId || !districtId || !zoneId) {
                    console.warn(
                        `⚠️  Missing geographical IDs for customer: ${exportCustomer.name}`,
                    );
                    errorCount++;
                    continue;
                }

                // Create address
                await db.insert(addresses).values({
                    customerId: customer.id,
                    addressType: "HOME",
                    divisionId,
                    districtId,
                    zoneId,
                    addressLine: addressData.addressLine,
                    details: addressData.divisionName
                        ? addressData.confidence !== undefined &&
                                addressData.confidence < 1.0
                            ? {
                                original: exportCustomer.address,
                                llm_confidence: addressData.confidence,
                                llm_notes: addressData.notes,
                            }
                            : null
                        : { original: exportCustomer.address }, // Store original if not normalized
                });

                successCount++;

                if (successCount % 10 === 0) {
                    console.log(`✅ Seeded ${successCount} customers...`);
                }
            } catch (err) {
                console.error(
                    `❌ Error seeding customer ${exportCustomer.name}:`,
                    err,
                );
                errorCount++;
            }
        }

        console.log("\n📊 Seeding Summary:");
        console.log(`✅ Successfully seeded: ${successCount}`);
        console.log(`⏭️  Skipped (duplicates): ${skipCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        if (lowConfidenceCount > 0) {
            console.log(
                `⚠️  Low confidence (<0.7) normalizations: ${lowConfidenceCount}`,
            );
        }
        console.log("🎉 Customer seeding completed!");
    }
}

// Main execution
async function main() {
    const filePath = process.argv[2] ||
        "./scripts/arma-data-export-2025-09-19T08-13-19-123Z.json";
    const normalizedPath = process.argv[3] ||
        "./scripts/extracted-addresses.json";

    const seeder = new CustomerSeeder();
    await seeder.seedCustomers(filePath, normalizedPath);
    process.exit(0);
}

main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
