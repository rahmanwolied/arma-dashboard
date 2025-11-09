/**
 * Batch Purchase Form Orchestrator
 * Multi-step wizard for batch cattle purchase
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PurchaseSetupForm } from "./components/PurchaseSetupForm";
import { CattleDetailsForm } from "./components/CattleDetailsForm";
import { BatchCostsForm } from "./components/BatchCostsForm";
import { ReviewPurchase } from "./components/ReviewPurchase";
import { SuccessModal } from "./components/SuccessModal";
import { useCreateBatchPurchase } from "./hooks/use-create-batch-purchase";
import { getNextTagNumber } from "./actions/get-tag-number";
import {
	BATCH_PURCHASE_STEPS,
	type BatchPurchaseStep,
	type BatchPurchaseData,
	type BatchCattleItem,
} from "./types";
import type { PurchaseSetupFormValues } from "./validations/batch-purchase-schema";

const getInitialData = (): BatchPurchaseData => {
	const today = new Date();
	const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

	return {
		purchaseDate: formattedDate,
		marketName: "",
		numberOfCattle: "",
		cattle: [],
		transportCost: "0",
		hasilFee: "0",
		miscCost: "0",
	};
};

export function BatchPurchaseForm() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState<BatchPurchaseStep>(
		BATCH_PURCHASE_STEPS.SETUP,
	);
	const [purchaseData, setPurchaseData] = useState<BatchPurchaseData>(
		getInitialData(),
	);

	const { form, handleSubmit, isPending, isError, isSuccess, error } =
		useCreateBatchPurchase();

	const updatePurchaseData = useCallback((data: Partial<BatchPurchaseData>) => {
		setPurchaseData((prev) => ({ ...prev, ...data }));
	}, []);

	const handleReset = () => {
		setPurchaseData(getInitialData());
		setCurrentStep(BATCH_PURCHASE_STEPS.SETUP);
	};

	const handleViewInventory = () => {
		router.push("/dashboard/cattle");
	};

	const renderStep = () => {
		switch (currentStep) {
			case BATCH_PURCHASE_STEPS.SETUP:
				return (
					<PurchaseSetupForm
						// onNext={handleSetupNext}
						form={form}
						onNext={() => setCurrentStep(BATCH_PURCHASE_STEPS.DETAILS)}
					/>
				);

			case BATCH_PURCHASE_STEPS.DETAILS:
				return (
					<CattleDetailsForm
						form={form}
						onNext={() => setCurrentStep(BATCH_PURCHASE_STEPS.COSTS)}
						onBack={() => setCurrentStep(BATCH_PURCHASE_STEPS.SETUP)}
						onClose={handleReset}
					/>
				);

			case BATCH_PURCHASE_STEPS.COSTS:
				return (
					<BatchCostsForm
						form={form}
						onNext={() => setCurrentStep(BATCH_PURCHASE_STEPS.REVIEW)}
						onBack={() => setCurrentStep(BATCH_PURCHASE_STEPS.DETAILS)}
						onClose={handleReset}
					/>
				);

			case BATCH_PURCHASE_STEPS.REVIEW:
				return (
					<ReviewPurchase
						form={form}
						onConfirm={() => handleSubmit(form.getValues())}
						onBack={() => setCurrentStep(BATCH_PURCHASE_STEPS.COSTS)}
						onEditDetails={() => setCurrentStep(BATCH_PURCHASE_STEPS.DETAILS)}
						onCancel={handleReset}
						isSubmitting={isPending}
					/>
				);

			case BATCH_PURCHASE_STEPS.SUCCESS:
				return (
					<SuccessModal
						purchaseData={purchaseData}
						onAddAnother={handleReset}
						onViewInventory={handleViewInventory}
					/>
				);

			default:
				return (
					<PurchaseSetupForm
						form={form}
						onNext={() => setCurrentStep(BATCH_PURCHASE_STEPS.DETAILS)}
					/>
				);
		}
	};

	return <div className="min-h-screen">{renderStep()}</div>;
}
