import { notFound } from "next/navigation";
import { db } from "@/db";
import { cattle, animals, animalPurchases } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { FlattenedCattle } from "../actions";
import { BatchPurchaseForm } from "../batch-purchase/BatchPurchaseForm";

type TCattleViewPageProps = {
	cattleId: string;
};

export default async function CattleViewPage({
	cattleId,
}: TCattleViewPageProps) {
	let cattleData: FlattenedCattle | null = null;
	let pageTitle = "Add New Cattle";

	if (cattleId !== "new") {
		// Fetch cattle with related animal and purchase data
		try {
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

			// Ensure we have the required cattle data
			if (!row.cattle) {
				notFound();
			}

			cattleData = {
				...row.animals,
				...row.cattle,
				...(row.animal_purchases || {}),
			} as FlattenedCattle;

			pageTitle = "Edit Cattle";
		} catch (error) {
			console.error(error);
			notFound();
		}
	}

	return <BatchPurchaseForm />;
}
