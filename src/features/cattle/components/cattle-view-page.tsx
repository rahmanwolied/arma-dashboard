import { notFound } from "next/navigation";
import CattleForm from "./cattle-form";
import { db } from "@/db";
import { cattle, animals, animalPurchases } from "@/db/schema";
import { eq } from "drizzle-orm";

type TCattleViewPageProps = {
	cattleId: string;
};

export default async function CattleViewPage({
	cattleId,
}: TCattleViewPageProps) {
	let cattleData = null;
	let pageTitle = "Add New Cattle";

	if (cattleId !== "new") {
		// Fetch cattle with related animal and purchase data
		const result = await db
			.select()
			.from(animals)
			.leftJoin(cattle, eq(cattle.animalId, animals.id))
			.leftJoin(animalPurchases, eq(animalPurchases.animalId, animals.id))
			.where(eq(animals.id, cattleId))
			.limit(1);

		if (!result || result.length === 0) {
			notFound();
		}

		const [row] = result;
		cattleData = {
			...row.animals,
			...row.cattle,
			...row.animal_purchases,
		};

		pageTitle = "Edit Cattle";
	}

	return <CattleForm initialData={cattleData} pageTitle={pageTitle} />;
}
