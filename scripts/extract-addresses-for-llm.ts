// scripts/extract-addresses-for-llm.ts
import * as fs from "node:fs/promises";

interface ExportCustomer {
    name: string;
    address: string;
    phone: string;
}

interface ExportData {
    data: {
        customers: ExportCustomer[];
    };
}

async function extractAddresses(
    filePath: string,
): Promise<{ phone: string; address: string }[]> {
    const rawData = await fs.readFile(filePath, "utf-8");
    const exportData: ExportData = JSON.parse(rawData);

    const addressMap = new Map<string, string>(); // Dedupe by phone

    for (const customer of exportData.data.customers) {
        if (
            customer.phone && customer.address &&
            !addressMap.has(customer.phone)
        ) {
            addressMap.set(customer.phone, customer.address);
        }
    }

    return Array.from(addressMap, ([phone, address]) => ({ phone, address }));
}

async function main() {
    const filePath = process.argv[2] ||
        "./scripts/arma-data-export-2025-09-19T08-13-19-123Z.json";
    const extracted = await extractAddresses(filePath);

    const outputPath = "./scripts/extracted-addresses.json";
    await fs.writeFile(outputPath, JSON.stringify(extracted, null, 2), "utf-8");

    console.log(
        `✅ Extracted ${extracted.length} unique addresses to ${outputPath}`,
    );
}

main().catch(console.error);
