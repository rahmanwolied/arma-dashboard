import React from "react";
import { PurchaseData } from "../types";
import CloseIcon from "../../src/features/cattle/batch-purchase/icons/CloseIcon";

interface Props {
	purchaseData: PurchaseData;
	updatePurchaseData: (data: Partial<PurchaseData>) => void;
	onNext: () => void;
	onBack: () => void;
	onClose: () => void;
}

const currencyFormatter = new Intl.NumberFormat("en-IN");

const BatchCosts: React.FC<Props> = ({
	purchaseData,
	updatePurchaseData,
	onNext,
	onBack,
	onClose,
}) => {
	const { transportCost, hasilFee, miscCost, numberOfCattle, cattle } =
		purchaseData;

	const totalSharedCost =
		(parseFloat(transportCost) || 0) +
		(parseFloat(hasilFee) || 0) +
		(parseFloat(miscCost) || 0);
	const numCattle = parseInt(numberOfCattle, 10) || 1;
	const perHeadShare = totalSharedCost / numCattle;
	const firstCattle = cattle[0] || { purchasePrice: "0" };
	const secondCattle = cattle[1] || { purchasePrice: "0" };

	const firstAdjusted =
		(parseFloat(firstCattle.purchasePrice) || 0) + perHeadShare;
	const secondAdjusted =
		(parseFloat(secondCattle.purchasePrice) || 0) + perHeadShare;

	const handleCostChange = (field: keyof PurchaseData, value: string) => {
		updatePurchaseData({ [field]: value });
	};

	return (
		<div className="p-4 md:p-8 max-w-[800px] mx-auto">
			<div className="bg-white rounded-t-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
				<div className="h-[72px] px-6 flex items-center justify-between">
					<h1 className="text-lg font-semibold text-[#1A1D23] tracking-[-0.01em]">
						BATCH COSTS - {purchaseData.purchaseDate} Purchase
					</h1>
					<div className="flex items-center">
						<button
							onClick={onBack}
							className="text-sm font-medium text-[#6B7280] px-4 py-2 rounded-md hover:bg-[#F3F4F6] hover:text-[#1A1D23] transition-colors mr-3"
						>
							← Back
						</button>
						<button
							onClick={onClose}
							className="text-[#6B7280] hover:text-[#1A1D23] rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
						>
							<CloseIcon className="w-5 h-5" />
						</button>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-b-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-8">
				<h2 className="text-base font-semibold text-[#1A1D23] mb-6">
					📦 Shared Costs for {numberOfCattle} Cattle
				</h2>

				<div className="space-y-5">
					<CostInput
						label="🚚 Transport Cost (Total)"
						value={transportCost}
						onChange={(e) => handleCostChange("transportCost", e.target.value)}
					/>
					<CostInput
						label="🧾 Hasil (Market Fee)"
						value={hasilFee}
						onChange={(e) => handleCostChange("hasilFee", e.target.value)}
					/>
					<CostInput
						label="🔧 Miscellaneous Costs"
						value={miscCost}
						onChange={(e) => handleCostChange("miscCost", e.target.value)}
					/>
				</div>

				<div
					className="my-5 w-full h-[1px] bg-repeat-x bg-center"
					style={{
						backgroundImage: `linear-gradient(to right, #D1D5DB 60%, transparent 40%)`,
						backgroundSize: "10px 1px",
					}}
				></div>

				<div className="flex justify-between items-center">
					<span className="text-base font-semibold text-[#1A1D23]">
						💰 Total Batch Costs:
					</span>
					<span className="text-lg font-bold text-[#2C5F4F]">
						{currencyFormatter.format(totalSharedCost)} ৳
					</span>
				</div>
			</div>

			{/* Preview Panel */}
			<div className="mt-8 bg-[#FFFBEB] border border-[#FDE68A] border-l-4 border-l-[#D97706] rounded-md p-6">
				<h3 className="text-sm font-bold text-[#92400E] tracking-wider mb-5">
					📊 COST DISTRIBUTION PREVIEW
				</h3>

				<div className="bg-white border border-[#FCD34D] rounded-md px-4 py-3 mb-5">
					<span className="text-sm text-[#78350F]">
						Per Cattle Share: {currencyFormatter.format(totalSharedCost)} ÷{" "}
						{numberOfCattle} ={" "}
					</span>
					<span className="text-sm font-bold text-[#92400E]">
						{currencyFormatter.format(Math.round(perHeadShare))} ৳ per head
					</span>
				</div>

				<div>
					<h4 className="text-sm font-semibold text-[#78350F] mb-3">
						Example Calculation:
					</h4>
					<ul className="space-y-2 text-sm">
						<li>
							<span className="text-[#D97706]"> • </span>
							<span className="font-medium text-[#78350F]">
								Cattle #{cattle[0]?.tagNo || "001"}:
							</span>
							<span className="text-[#92400E]">
								{" "}
								Base Price{" "}
								{currencyFormatter.format(
									parseFloat(firstCattle.purchasePrice) || 0,
								)}{" "}
								+ Share {currencyFormatter.format(Math.round(perHeadShare))}
							</span>
							<span className="text-[#D97706] mx-1.5">→</span>
							<span className="font-semibold text-[#92400E]">
								Adjusted Price:{" "}
								{currencyFormatter.format(Math.round(firstAdjusted))} ৳
							</span>
						</li>
						{cattle.length > 1 && (
							<li>
								<span className="text-[#D97706]"> • </span>
								<span className="font-medium text-[#78350F]">
									Cattle #{cattle[1]?.tagNo || "002"}:
								</span>
								<span className="text-[#92400E]">
									{" "}
									Base Price{" "}
									{currencyFormatter.format(
										parseFloat(secondCattle.purchasePrice) || 0,
									)}{" "}
									+ Share {currencyFormatter.format(Math.round(perHeadShare))}
								</span>
								<span className="text-[#D97706] mx-1.5">→</span>
								<span className="font-semibold text-[#92400E]">
									Adjusted Price:{" "}
									{currencyFormatter.format(Math.round(secondAdjusted))} ৳
								</span>
							</li>
						)}
					</ul>
				</div>
			</div>

			{/* Action Bar */}
			<div className="mt-8 bg-white border-t border-[#E2E4E8] py-5 px-8 flex justify-between items-center shadow-[0_-2px_8px_rgba(0,0,0,0.06)] sticky bottom-0">
				<button
					onClick={onBack}
					className="h-[44px] px-6 text-base font-medium text-[#6B7280] bg-transparent border border-[#E2E4E8] rounded-md hover:bg-[#F8F9FA] hover:text-[#1A1D23] hover:border-[#9CA3AF] transition-colors"
				>
					← Back to Edit Details
				</button>
				<button
					onClick={onNext}
					className="h-[44px] px-7 flex items-center text-base font-medium text-white bg-[#2C5F4F] rounded-md hover:bg-[#1F4436] active:bg-[#163228] transition-colors"
				>
					Review & Save →
				</button>
			</div>
		</div>
	);
};

const CostInput: React.FC<{
	label: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, value, onChange }) => (
	<div>
		<label className="flex items-center text-sm font-medium text-[#6B7280] tracking-[0.01em] mb-2">
			{label}
		</label>
		<div className="flex items-center">
			<input
				type="number"
				value={value}
				onChange={onChange}
				className="w-[180px] h-[44px] bg-[#F8F9FA] border border-[#E2E4E8] rounded-l-md px-3 text-base text-[#1A1D23] text-right focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent"
			/>
			<span className="h-[44px] w-[50px] flex items-center justify-center bg-[#E5E7EB] border border-l-0 border-[#E2E4E8] rounded-r-md text-base font-medium text-[#4B5563]">
				৳
			</span>
		</div>
	</div>
);

export default BatchCosts;
