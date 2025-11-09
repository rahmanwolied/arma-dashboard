/**
 * Hook for managing cattle data initialization and row addition
 * Handles initial cattle array setup and adding new cattle entries
 */

import { useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CompleteBatchPurchaseFormValues } from "../validations/batch-purchase-schema";
import type { BatchCattleItem } from "../types";

interface UseCattleInitializationProps {
	form: UseFormReturn<CompleteBatchPurchaseFormValues>;
	nextTagNumber: string | null;
}

export function useCattleInitialization({
	form,
	nextTagNumber,
}: UseCattleInitializationProps) {

	useEffect(() => {
		if (form.getValues("cattle").length > 0) return;
		if (!nextTagNumber) nextTagNumber = "001";

		const tagStart = Number.parseInt(nextTagNumber, 10);
		const numberOfCattle = Number(form.getValues("numberOfCattle"));
		const tagEnd = tagStart + numberOfCattle - 1;

		const tags = Array.from(
			{ length: tagEnd - tagStart + 1 },
			(_, i) => `${(tagStart + i).toString().padStart(3, "0")}`,
		);

		form.setValue(
			"cattle",
			tags.map((tag, index) => ({
				id: index + 1,
				tagNo: tag,
				weight: "",
				purchasePrice: "",
			})),
		);

	}, [nextTagNumber, form]);

	const handleAddRow = () => {
		const currentCattle = form.getValues("cattle");
		const currentNumberOfCattle = Number(form.getValues("numberOfCattle"));

		const lastTagNo = currentCattle[currentCattle.length - 1]?.tagNo || "000";
		const nextTag = (Number.parseInt(lastTagNo, 10) + 1)
			.toString()
			.padStart(3, "0");

		const newCattle: BatchCattleItem = {
			id: currentCattle.length + 1,
			tagNo: nextTag,
			weight: "",
			purchasePrice: "",
		};

		form.setValue("cattle", [...currentCattle, newCattle]);
		form.setValue("numberOfCattle", (currentNumberOfCattle + 1).toString());
	};

	return {
		handleAddRow,
	};
}

