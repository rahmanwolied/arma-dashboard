"use client";
import type React from "react";
import { useState, useCallback } from "react";
import PurchaseSetupModal from "./components/PurchaseSetupModal";
import CattleDetailsEntry from "./components/CattleDetailsEntry";
import BatchCosts from "./components/BatchCosts";
import ReviewPurchase from "./components/ReviewPurchase";
import SuccessModal from "./components/SuccessModal";

const getInitialData = (): PurchaseData => {
	const today = new Date();
	const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
	return {
		purchaseDate: formattedDate,
		marketName: "",
		numberOfCattle: "",
		cattle: [],
		transportCost: "12000",
		hasilFee: "3500",
		miscCost: "1500",
	};
};

const BatchPurchaseForm: React.FC = () => {
	const [screen, setScreen] = useState<any>(Screen.SETUP);
	const [purchaseData, setPurchaseData] = useState<PurchaseData>(
		getInitialData(),
	);

	const handleReset = () => {
		setPurchaseData(getInitialData());
		setScreen(Screen.SETUP);
	};

	const updatePurchaseData = useCallback((data: Partial<PurchaseData>) => {
		setPurchaseData((prev) => ({ ...prev, ...data }));
	}, []);

	const handleSetupNext = (data: {
		purchaseDate: string;
		marketName: string;
		numberOfCattle: string;
	}) => {
		const numCattle = parseInt(data.numberOfCattle, 10) || 0;
		const initialCattle: Cattle[] = Array.from(
			{ length: numCattle },
			(_, i) => ({
				id: i,
				tagNo: String(i + 1).padStart(3, "0"),
				weight: "",
				purchasePrice: "",
			}),
		);
		updatePurchaseData({ ...data, cattle: initialCattle });
		setScreen(Screen.DETAILS);
	};

	const renderScreen = () => {
		switch (screen) {
			case Screen.SETUP:
				return (
					<PurchaseSetupModal
						onNext={handleSetupNext}
						initialData={purchaseData}
					/>
				);
			case Screen.DETAILS:
				return (
					<CattleDetailsEntry
						purchaseData={purchaseData}
						updatePurchaseData={updatePurchaseData}
						onNext={() => setScreen(Screen.COSTS)}
						onBack={() => setScreen(Screen.SETUP)}
						onClose={handleReset}
					/>
				);
			case Screen.COSTS:
				return (
					<BatchCosts
						purchaseData={purchaseData}
						updatePurchaseData={updatePurchaseData}
						onNext={() => setScreen(Screen.REVIEW)}
						onBack={() => setScreen(Screen.DETAILS)}
						onClose={handleReset}
					/>
				);
			case Screen.REVIEW:
				return (
					<ReviewPurchase
						purchaseData={purchaseData}
						onConfirm={() => setScreen(Screen.SUCCESS)}
						onBack={() => setScreen(Screen.COSTS)}
						onEditDetails={() => setScreen(Screen.DETAILS)}
						onCancel={handleReset}
					/>
				);
			case Screen.SUCCESS:
				return (
					<SuccessModal
						purchaseData={purchaseData}
						onAddAnother={handleReset}
						onViewInventory={() => {
							alert("Viewing inventory...");
							handleReset();
						}}
					/>
				);
			default:
				return (
					<PurchaseSetupModal
						onNext={handleSetupNext}
						initialData={purchaseData}
					/>
				);
		}
	};

	return (
		<div className="bg-[#F8F9FA] min-h-screen text-[#1A1D23]">
			{renderScreen()}
		</div>
	);
};

export default BatchPurchaseForm;
