import React from "react";
import CheckIcon from "../../src/features/cattle/batch-purchase/icons/CheckIcon";
import { PurchaseData } from "../types";

interface Props {
	purchaseData: PurchaseData;
	onAddAnother: () => void;
	onViewInventory: () => void;
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

const SuccessModal: React.FC<Props> = ({
	purchaseData,
	onAddAnother,
	onViewInventory,
}) => {
	const {
		cattle,
		numberOfCattle,
		transportCost,
		hasilFee,
		miscCost,
		purchaseDate,
	} = purchaseData;
	const totalBasePrice = cattle.reduce(
		(sum, c) => sum + (parseFloat(c.purchasePrice) || 0),
		0,
	);
	const sharedCosts =
		(parseFloat(transportCost) || 0) +
		(parseFloat(hasilFee) || 0) +
		(parseFloat(miscCost) || 0);
	const grandTotal = totalBasePrice + sharedCosts;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-2xl w-full max-w-[480px] p-10 flex flex-col items-center text-center">
				<div className="w-20 h-20 rounded-full bg-[#D1FAE5] flex items-center justify-center mb-6">
					<CheckIcon className="w-16 h-16 text-[#059669]" />
				</div>
				<h2 className="text-2xl font-bold text-[#065F46] mb-4">✓ Success!</h2>
				<p className="text-base text-[#1A1D23]">
					{numberOfCattle} cattle successfully added to inventory
				</p>
				<p className="text-sm text-[#6B7280] mt-1">
					Purchase Date: {dateFormatter(purchaseDate)}
				</p>
				<p className="text-base font-semibold text-[#2C5F4F] mt-3">
					Total Investment: {currencyFormatter.format(grandTotal)} ৳
				</p>
				<div className="flex items-center gap-3 mt-8">
					<button
						onClick={onViewInventory}
						className="h-[44px] px-6 text-sm font-medium text-[#2C5F4F] bg-transparent border border-[#2C5F4F] rounded-md hover:bg-[#F0FDF4] transition-colors"
					>
						View Inventory
					</button>
					<button
						onClick={onAddAnother}
						className="h-[44px] px-6 text-sm font-medium text-white bg-[#2C5F4F] rounded-md hover:bg-[#1F4436] transition-colors"
					>
						Add Another Purchase
					</button>
				</div>
			</div>
		</div>
	);
};

export default SuccessModal;
