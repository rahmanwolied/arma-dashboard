import React from "react";
import { PurchaseData } from "../types";
import CloseIcon from "../../src/features/cattle/batch-purchase/icons/CloseIcon";
import CheckIcon from "../../src/features/cattle/batch-purchase/icons/CheckIcon";

interface Props {
	purchaseData: PurchaseData;
	onConfirm: () => void;
	onBack: () => void;
	onEditDetails: () => void;
	onCancel: () => void;
}

const currencyFormatter = new Intl.NumberFormat("en-IN");
const dateFormatter = (dateStr: string) => {
	const [day, month, year] = dateStr.split("/");
	const date = new Date(`${year}-${month}-${day}`);
	return date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

const ReviewPurchase: React.FC<Props> = ({
	purchaseData,
	onConfirm,
	onBack,
	onEditDetails,
	onCancel,
}) => {
	const {
		cattle,
		marketName,
		purchaseDate,
		numberOfCattle,
		transportCost,
		hasilFee,
		miscCost,
	} = purchaseData;

	const totalBasePrice = cattle.reduce(
		(sum, c) => sum + (parseFloat(c.purchasePrice) || 0),
		0,
	);
	const sharedCosts =
		(parseFloat(transportCost) || 0) +
		(parseFloat(hasilFee) || 0) +
		(parseFloat(miscCost) || 0);
	const perHeadShare = sharedCosts / (parseInt(numberOfCattle, 10) || 1);
	const grandTotal = totalBasePrice + sharedCosts;
	const avgCostPerHead = grandTotal / (parseInt(numberOfCattle, 10) || 1);

	return (
		<div className="p-4 md:p-8 max-w-[900px] mx-auto">
			<div className="bg-white rounded-t-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
				<div className="h-[72px] px-6 flex items-center justify-between">
					<h1 className="text-lg font-semibold text-[#1A1D23] tracking-[-0.01em]">
						REVIEW PURCHASE - {purchaseDate}
					</h1>
					<div className="flex items-center">
						<button
							onClick={onBack}
							className="text-sm font-medium text-[#6B7280] px-4 py-2 rounded-md hover:bg-[#F3F4F6] hover:text-[#1A1D23] transition-colors mr-3"
						>
							← Back
						</button>
						<button
							onClick={onCancel}
							className="text-[#6B7280] hover:text-[#1A1D23] rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
						>
							<CloseIcon className="w-5 h-5" />
						</button>
					</div>
				</div>
			</div>

			<div className="flex flex-wrap md:flex-nowrap gap-6 mt-1">
				{/* Purchase Summary */}
				<div className="w-full md:w-1/2 bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
					<h2 className="text-base font-semibold text-[#1A1D23] mb-4">
						📋 Purchase Summary
					</h2>
					<ul className="space-y-3 text-sm">
						<SummaryItem label="Date:" value={dateFormatter(purchaseDate)} />
						<SummaryItem label="Market:" value={marketName} />
						<SummaryItem
							label="Total Cattle:"
							value={`${numberOfCattle} heads`}
						/>
					</ul>
				</div>
				{/* Financial Summary */}
				<div className="w-full md:w-1/2 bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
					<h2 className="text-base font-semibold text-[#1A1D23] mb-4">
						💰 Financial Summary
					</h2>
					<div className="bg-[#F8F9FA] border border-[#E2E4E8] rounded p-4 text-sm space-y-2">
						<FinancialItem
							label="Total Purchase Value:"
							value={totalBasePrice}
							helper="← Sum of base prices"
						/>
						<FinancialItem
							label="+ Transport:"
							value={parseFloat(transportCost) || 0}
						/>
						<FinancialItem label="+ Hasil:" value={parseFloat(hasilFee) || 0} />
						<FinancialItem
							label="+ Miscellaneous:"
							value={parseFloat(miscCost) || 0}
						/>
						<div
							className="my-2 w-full h-[1px] bg-repeat-x bg-center"
							style={{
								backgroundImage: `linear-gradient(to right, #D1D5DB 60%, transparent 40%)`,
								backgroundSize: "10px 1px",
							}}
						></div>
						<div className="!mt-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded -mx-2 px-3 py-2.5 flex justify-between items-center">
							<span className="text-base font-bold text-[#065F46]">
								Grand Total Investment:
							</span>
							<span className="text-base font-bold text-[#065F46]">
								{currencyFormatter.format(grandTotal)} ৳
							</span>
						</div>
						<div className="!mt-3 pt-2 flex justify-between items-center text-sm font-medium text-[#6B7280]">
							<span>Average Cost per Head:</span>
							<span>
								{currencyFormatter.format(Math.round(avgCostPerHead))} ৳
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Individual Cattle Table */}
			<div className="mt-8 bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-base font-semibold text-[#1A1D23]">
						📊 Individual Cattle (showing 5 of {numberOfCattle})
					</h2>
					<button className="text-sm font-medium text-[#2563EB] hover:underline">
						[View All ▼]
					</button>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead>
							<tr className="bg-[#F8F9FA] h-[40px] border-b-2 border-[#E2E4E8] text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
								<th className="p-2.5 text-left">Tag</th>
								<th className="p-2.5 text-left">Weight</th>
								<th className="p-2.5 text-left">Base Price</th>
								<th className="p-2.5 text-left">Share</th>
								<th className="p-2.5 text-left">Adjusted Price</th>
								<th className="p-2.5 text-center">✓</th>
							</tr>
						</thead>
						<tbody>
							{cattle.slice(0, 5).map((c) => (
								<tr
									key={c.id}
									className="h-[48px] border-b border-[#E2E4E8] text-sm text-[#1A1D23] hover:bg-[#F8F9FA]"
								>
									<td className="p-3">{c.tagNo}</td>
									<td className="p-3">{c.weight}kg</td>
									<td className="p-3">
										{currencyFormatter.format(parseFloat(c.purchasePrice) || 0)}{" "}
										৳
									</td>
									<td className="p-3 text-[#6B7280]">
										{currencyFormatter.format(Math.round(perHeadShare))} ৳
									</td>
									<td className="p-3 font-semibold text-[#2C5F4F]">
										{currencyFormatter.format(
											Math.round(
												(parseFloat(c.purchasePrice) || 0) + perHeadShare,
											),
										)}{" "}
										৳
									</td>
									<td className="p-3 text-center text-[#059669]">
										<CheckIcon className="w-5 h-5 inline-block" />
									</td>
								</tr>
							))}
							{cattle.length > 5 && (
								<tr className="text-[#D1D5DB]">
									<td className="p-3 text-center" colSpan={6}>
										...
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<div className="mt-6 bg-[#FFFBEB] border border-[#FDE68A] border-l-4 border-l-[#F59E0B] rounded-md p-3 flex items-center">
				<span className="text-[#F59E0B]">⚠️</span>
				<p className="ml-2 text-sm text-[#78350F]">
					Note: This will create {numberOfCattle} new inventory records
				</p>
			</div>

			<div className="mt-8 bg-white border-t border-[#E2E4E8] py-5 px-8 flex justify-between items-center shadow-[0_-2px_8px_rgba(0,0,0,0.06)] sticky bottom-0">
				<button
					onClick={onEditDetails}
					className="h-[44px] px-6 text-base font-medium text-[#6B7280] bg-transparent border border-[#E2E4E8] rounded-md hover:bg-[#F8F9FA] hover:text-[#1A1D23] hover:border-[#9CA3AF] transition-colors"
				>
					← Edit Details
				</button>
				<div className="flex items-center">
					<button
						onClick={onCancel}
						className="h-[44px] px-6 text-base font-medium text-[#6B7280] bg-transparent border border-[#E2E4E8] rounded-md hover:bg-[#F8F9FA] hover:text-[#1A1D23] hover:border-[#9CA3AF] transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="ml-3 h-[44px] px-8 flex items-center text-base font-medium text-white bg-[#2C5F4F] rounded-md hover:bg-[#1F4436] active:bg-[#163228] transition-colors"
					>
						<CheckIcon className="w-5 h-5 mr-2" /> Confirm & Save Purchase
					</button>
				</div>
			</div>
		</div>
	);
};

const SummaryItem: React.FC<{ label: string; value: string }> = ({
	label,
	value,
}) => (
	<li className="flex items-center">
		<span className="text-[#9CA3AF] mr-2">•</span>
		<span className="text-[#6B7280] w-28">{label}</span>
		<span className="font-medium text-[#1A1D23]">{value}</span>
	</li>
);

const FinancialItem: React.FC<{
	label: string;
	value: number;
	helper?: string;
}> = ({ label, value, helper }) => (
	<div className="flex justify-between items-center">
		<div className="flex items-center">
			<span>{label}</span>
			{helper && (
				<span className="ml-3 text-xs italic text-[#9CA3AF]">{helper}</span>
			)}
		</div>
		<span>{currencyFormatter.format(value)} ৳</span>
	</div>
);

export default ReviewPurchase;
