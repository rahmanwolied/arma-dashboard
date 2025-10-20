import { db } from "./db";
import {
    addresses,
    animals,
    cattle,
    customers,
    payments,
    saleAnimalLinks,
    sales,
    weightRecords,
} from "../src/db/schema";

// Sample sales data with various scenarios
const salesData = [
    {
        customer: {
            name: "Md. Rafiqul Islam",
            phone: "01712-345678",
            email: "rafiq@example.com",
            address: "House 23, Road 5, Dhanmondi, Dhaka",
        },
        cattle: [
            {
                tagNumber: "CTL-001",
                weight: 285,
                gender: "MALE" as const,
            },
        ],
        pricePerKg: 520,
        discountType: "FLAT" as const,
        discountInput: 5000,
        paymentMethod: "CASH" as const,
        amountPaid: 140200,
    },
    {
        customer: {
            name: "Fatema Begum",
            phone: "01819-234567",
            email: "fatema@example.com",
            address: "Flat 4B, Gulshan-2, Dhaka",
        },
        cattle: [
            {
                tagNumber: "CTL-002",
                weight: 245,
                gender: "FEMALE" as const,
            },
        ],
        pricePerKg: 500,
        discountType: "PERCENT" as const,
        discountInput: 10,
        paymentMethod: "BANK_TRANSFER" as const,
        amountPaid: 110250,
    },
    {
        customer: {
            name: "Abdul Karim",
            phone: "01918-345678",
            address: "Village: Char Bangla, Munshiganj",
        },
        cattle: [
            {
                tagNumber: "CTL-003",
                weight: 320,
                gender: "MALE" as const,
            },
            {
                tagNumber: "CTL-004",
                weight: 290,
                gender: "MALE" as const,
            },
        ],
        pricePerKg: 530,
        discountType: "WEIGHT_BASED" as const,
        discountInput: 15,
        paymentMethod: "CASH" as const,
        amountPaid: 315350,
    },
    {
        customer: {
            name: "Nasrin Akter",
            phone: "01717-456789",
            email: "nasrin@example.com",
            address: "House 45, Banani, Dhaka",
        },
        cattle: [
            {
                tagNumber: "CTL-005",
                weight: 265,
                gender: "FEMALE" as const,
            },
        ],
        pricePerKg: 510,
        paymentMethod: "MOBILE_MONEY" as const,
        amountPaid: 135150,
    },
    {
        customer: {
            name: "Jahangir Alam",
            phone: "01615-567890",
            address: "Sector 7, Uttara, Dhaka",
        },
        cattle: [
            {
                tagNumber: "CTL-006",
                weight: 275,
                gender: "MALE" as const,
            },
        ],
        pricePerKg: 515,
        discountType: "FLAT" as const,
        discountInput: 3000,
        paymentMethod: "CASH" as const,
        amountPaid: 138625,
    },
    {
        customer: {
            name: "Shahina Parveen",
            phone: "01912-678901",
            email: "shahina@example.com",
            address: "Road 15, Block C, Bashundhara R/A, Dhaka",
        },
        cattle: [
            {
                tagNumber: "CTL-007",
                weight: 255,
                gender: "FEMALE" as const,
            },
        ],
        pricePerKg: 505,
        discountType: "PERCENT" as const,
        discountInput: 5,
        paymentMethod: "BANK_TRANSFER" as const,
        amountPaid: 122362.5,
    },
    {
        customer: {
            name: "Mizanur Rahman",
            phone: "01811-789012",
            address: "House 78, Mirpur-10, Dhaka",
        },
        cattle: [
            {
                tagNumber: "CTL-008",
                weight: 300,
                gender: "MALE" as const,
            },
        ],
        pricePerKg: 525,
        discountType: "WEIGHT_BASED" as const,
        discountInput: 10,
        paymentMethod: "CASH" as const,
        amountPaid: 152250,
    },
    {
        customer: {
            name: "Farhana Khan",
            phone: "01716-890123",
            email: "farhana.khan@example.com",
            address: "Plot 23, Mohammadpur, Dhaka",
        },
        cattle: [
            {
                tagNumber: "CTL-009",
                weight: 270,
                gender: "FEMALE" as const,
            },
        ],
        pricePerKg: 510,
        paymentMethod: "MOBILE_MONEY" as const,
        amountPaid: 137700,
    },
    {
        customer: {
            name: "Kamal Hossain",
            phone: "01913-901234",
            address: "House 12, Lalmatia, Dhaka",
        },
        cattle: [
            {
                tagNumber: "CTL-010",
                weight: 295,
                gender: "MALE" as const,
            },
            {
                tagNumber: "CTL-011",
                weight: 280,
                gender: "MALE" as const,
            },
        ],
        pricePerKg: 520,
        discountType: "FLAT" as const,
        discountInput: 10000,
        paymentMethod: "CASH" as const,
        amountPaid: 289000,
    },
    {
        customer: {
            name: "Salma Khatun",
            phone: "01614-012345",
            email: "salma@example.com",
            address: "House 34, Rampura, Dhaka",
        },
        cattle: [
            {
                tagNumber: "CTL-012",
                weight: 260,
                gender: "FEMALE" as const,
            },
        ],
        pricePerKg: 500,
        discountType: "PERCENT" as const,
        discountInput: 8,
        paymentMethod: "BANK_TRANSFER" as const,
        amountPaid: 119600,
    },
    {
        customer: {
            name: "Habibur Rahman",
            phone: "01718-123456",
            address: "Village: Sreenagar, Munshiganj",
        },
        cattle: [
            {
                tagNumber: "CTL-013",
                weight: 310,
                gender: "MALE" as const,
            },
        ],
        pricePerKg: 535,
        discountType: "WEIGHT_BASED" as const,
        discountInput: 12,
        paymentMethod: "CASH" as const,
        amountPaid: 159460,
    },
    {
        customer: {
            name: "Ayesha Siddiqua",
            phone: "01914-234567",
            email: "ayesha@example.com",
            address: "House 56, Baridhara DOHS, Dhaka",
        },
        cattle: [
            {
                tagNumber: "CTL-014",
                weight: 250,
                gender: "FEMALE" as const,
            },
        ],
        pricePerKg: 495,
        paymentMethod: "MOBILE_MONEY" as const,
        amountPaid: 123750,
    },
    {
        customer: {
            name: "Nurul Islam",
            phone: "01812-345678",
            address: "House 89, Khilgaon, Dhaka",
        },
        cattle: [
            {
                tagNumber: "CTL-015",
                weight: 278,
                gender: "MALE" as const,
            },
        ],
        pricePerKg: 515,
        discountType: "FLAT" as const,
        discountInput: 4000,
        paymentMethod: "CASH" as const,
        amountPaid: 139170,
    },
    {
        customer: {
            name: "Rokia Begum",
            phone: "01715-456789",
            email: "rokia@example.com",
            address: "Road 8, Dhanmondi, Dhaka",
        },
        cattle: [
            {
                tagNumber: "CTL-016",
                weight: 268,
                gender: "FEMALE" as const,
            },
        ],
        pricePerKg: 505,
        discountType: "PERCENT" as const,
        discountInput: 7,
        paymentMethod: "BANK_TRANSFER" as const,
        amountPaid: 125946,
    },
    {
        customer: {
            name: "Anwar Hossain",
            phone: "01616-567890",
            address: "House 101, Tejgaon, Dhaka",
        },
        cattle: [
            {
                tagNumber: "CTL-017",
                weight: 305,
                gender: "MALE" as const,
            },
        ],
        pricePerKg: 530,
        discountType: "WEIGHT_BASED" as const,
        discountInput: 8,
        paymentMethod: "CASH" as const,
        amountPaid: 157410,
    },
];

// Helper function to calculate discount
function calculateDiscount(
    totalWeight: number,
    pricePerKg: number,
    discountType?: "FLAT" | "PERCENT" | "WEIGHT_BASED",
    discountInput?: number,
): number {
    if (!discountType || !discountInput) return 0;

    const totalAmount = totalWeight * pricePerKg;

    switch (discountType) {
        case "FLAT":
            return discountInput;
        case "PERCENT":
            return Math.round((totalAmount * discountInput) / 100);
        case "WEIGHT_BASED":
            return Math.round(pricePerKg * discountInput);
        default:
            return 0;
    }
}

// Generate invoice number
function generateInvoiceNumber(index: number): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `INV-${year}${month}-${String(index + 1).padStart(4, "0")}`;
}

async function seedSalesData() {
    console.log("🌱 Starting to seed sales data with Drizzle ORM...");

    try {
        // Use a transaction to ensure data consistency
        await db.transaction(async (tx) => {
            for (let i = 0; i < salesData.length; i++) {
                const saleData = salesData[i];
                console.log(
                    `\n📦 Processing sale ${
                        i + 1
                    }/${salesData.length} for ${saleData.customer.name}`,
                );

                // 1. Create customer
                const [customer] = await tx
                    .insert(customers)
                    .values({
                        name: saleData.customer.name,
                        primaryPhone: saleData.customer.phone,
                        email: saleData.customer.email || null,
                    })
                    .returning();

                console.log(`  ✅ Created customer: ${customer.name}`);

                // 2. Create customer address
                if (saleData.customer.address) {
                    await tx.insert(addresses).values({
                        customerId: customer.id,
                        addressLine: saleData.customer.address,
                        isPrimary: true,
                    });
                    console.log(`  ✅ Created address for customer`);
                }

                // 3. Create animals and cattle
                const animalIds: string[] = [];
                for (const cattleData of saleData.cattle) {
                    // Create animal
                    const [animal] = await tx
                        .insert(animals)
                        .values({
                            animalType: "CATTLE",
                            status: "SOLD", // Mark as sold
                        })
                        .returning();

                    animalIds.push(animal.id);

                    // Create cattle
                    await tx.insert(cattle).values({
                        animalId: animal.id,
                        tagNumber: cattleData.tagNumber,
                        gender: cattleData.gender,
                        healthStatus: "HEALTHY",
                        isQuarantined: false,
                        isPregnant: cattleData.gender === "FEMALE" &&
                            Math.random() < 0.3,
                        isLactating: cattleData.gender === "FEMALE" &&
                            Math.random() < 0.2,
                    });

                    // Create weight record
                    await tx.insert(weightRecords).values({
                        animalId: animal.id,
                        weightKg: cattleData.weight.toString(),
                        onSale: true,
                        recordedAt: new Date(),
                    });

                    console.log(
                        `  ✅ Created cattle: ${cattleData.tagNumber} (${cattleData.weight} kg)`,
                    );
                }

                // 4. Calculate totals
                const totalWeight = saleData.cattle.reduce(
                    (sum, c) => sum + c.weight,
                    0,
                );
                const totalAmount = totalWeight * saleData.pricePerKg;
                const discountAmount = calculateDiscount(
                    totalWeight,
                    saleData.pricePerKg,
                    saleData.discountType,
                    saleData.discountInput,
                );
                const finalAmount = totalAmount - discountAmount;
                const amountDue = finalAmount - saleData.amountPaid;

                // 5. Create sale
                const [sale] = await tx
                    .insert(sales)
                    .values({
                        farmId: "default-farm-id",
                        customerId: customer.id,
                        invoiceNumber: generateInvoiceNumber(i),
                        totalAmount: totalAmount.toFixed(2),
                        discountAmount: discountAmount > 0
                            ? discountAmount.toFixed(2)
                            : null,
                        discountType: saleData.discountType || null,
                        amountPaid: saleData.amountPaid.toFixed(2),
                        amountDue: amountDue.toFixed(2),
                        isCredit: amountDue > 0,
                        paymentTerms: amountDue > 0
                            ? "Payment due within 30 days"
                            : null,
                        saleDate: new Date(),
                    })
                    .returning();

                console.log(`  ✅ Created sale: ${sale.invoiceNumber}`);

                // 6. Link animals to sale
                for (const animalId of animalIds) {
                    await tx.insert(saleAnimalLinks).values({
                        saleId: sale.id,
                        animalId,
                    });
                }

                console.log(`  ✅ Linked ${animalIds.length} animals to sale`);

                // 7. Create payment record
                await tx.insert(payments).values({
                    saleId: sale.id,
                    paidAmount: saleData.amountPaid.toFixed(2),
                    paidAt: new Date(),
                    paymentMethod: saleData.paymentMethod,
                });

                console.log(
                    `  ✅ Created payment: ৳${saleData.amountPaid.toLocaleString()}`,
                );
            }
        });

        console.log("\n🎉 Successfully seeded all sales data!");

        // Print summary
        const totalCustomers = await db.select().from(customers);
        const totalAnimals = await db.select().from(animals);
        const totalSales = await db.select().from(sales);
        const totalPayments = await db.select().from(payments);

        console.log("\n📊 Database Summary:");
        console.log(`   Customers: ${totalCustomers.length}`);
        console.log(`   Animals: ${totalAnimals.length}`);
        console.log(`   Sales: ${totalSales.length}`);
        console.log(`   Payments: ${totalPayments.length}`);
    } catch (error) {
        console.error("❌ Error seeding sales data:", error);
        throw error;
    }
}

// Run the seed function
if (require.main === module) {
    seedSalesData()
        .then(() => {
            console.log("\n✅ Seeding completed successfully");
            process.exit(0);
        })
        .catch((error) => {
            console.error("\n❌ Seeding failed:", error);
            process.exit(1);
        });
}

export default seedSalesData;

