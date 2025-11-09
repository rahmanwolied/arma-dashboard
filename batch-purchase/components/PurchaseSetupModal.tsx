import React, { useState, useEffect } from "react";
import CloseIcon from "../../src/features/cattle/batch-purchase/icons/CloseIcon";
import ChevronDownIcon from "../../src/features/cattle/batch-purchase/icons/ChevronDownIcon";
import { PurchaseData } from "../types";

interface Props {
	onNext: (data: {
		purchaseDate: string;
		marketName: string;
		numberOfCattle: string;
	}) => void;
	initialData: PurchaseData;
}

const PurchaseSetupModal: React.FC<Props> = ({ onNext, initialData }) => {
	const [date, setDate] = useState(initialData.purchaseDate);
	const [market, setMarket] = useState(initialData.marketName);
	const [cattleCount, setCattleCount] = useState(initialData.numberOfCattle);
	const [isFormValid, setIsFormValid] = useState(false);
	const [showMarketDropdown, setShowMarketDropdown] = useState(false);
	const recentMarkets = [
		"Chattogram Market",
		"Dhaka Central Market",
		"Sylhet Livestock Exchange",
	];

	useEffect(() => {
		setIsFormValid(
			date.trim() !== "" &&
				market.trim() !== "" &&
				cattleCount.trim() !== "" &&
				parseInt(cattleCount, 10) > 0,
		);
	}, [date, market, cattleCount]);

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const [year, month, day] = e.target.value.split("-");
		setDate(`${day}/${month}/${year}`);
	};

	const handleNext = () => {
		if (isFormValid) {
			onNext({
				purchaseDate: date,
				marketName: market,
				numberOfCattle: cattleCount,
			});
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 transition-opacity duration-300">
			<div
				className="bg-white rounded-lg shadow-2xl w-full max-w-[540px] transform transition-all duration-300 scale-100"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="h-[64px] px-5 py-5 flex items-center justify-between border-b border-[#E2E4E8]">
					<h2 className="text-xl font-semibold text-[#1A1D23] tracking-[-0.01em]">
						NEW CATTLE PURCHASE
					</h2>
					<button className="text-[#6B7280] hover:text-[#1A1D23] rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#F3F4F6] transition-colors">
						<CloseIcon className="w-5 h-5" />
					</button>
				</div>

				{/* Form Body */}
				<div className="px-8 py-7">
					{/* Purchase Date */}
					<div className="mb-6">
						<label className="flex items-center text-sm font-medium text-[#6B7280] tracking-[0.01em] mb-2">
							📅 Purchase Date <span className="text-[#DC2626] ml-0.5">*</span>
						</label>
						<div className="relative">
							<input
								type="text"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								onFocus={(e) => (e.target.type = "date")}
								onBlur={(e) => (e.target.type = "text")}
								className="w-full h-[44px] bg-[#F8F9FA] border border-[#E2E4E8] rounded-md px-3 text-base text-[#1A1D23] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent"
							/>
						</div>
						<p className="text-xs text-[#9CA3AF] italic mt-1.5">
							← Auto-filled with today
						</p>
					</div>

					{/* Market Name */}
					<div className="mb-6 relative">
						<label className="flex items-center text-sm font-medium text-[#6B7280] tracking-[0.01em] mb-2">
							🏪 Market Name <span className="text-[#DC2626] ml-0.5">*</span>
						</label>
						<div className="relative">
							<input
								type="text"
								value={market}
								onChange={(e) => setMarket(e.target.value)}
								onFocus={() => setShowMarketDropdown(true)}
								onBlur={() =>
									setTimeout(() => setShowMarketDropdown(false), 150)
								}
								placeholder="Select Market"
								className="w-full h-[44px] bg-[#F8F9FA] border border-[#E2E4E8] rounded-md px-3 text-base text-[#1A1D23] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent"
							/>
							<ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
						</div>
						{showMarketDropdown && (
							<div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-[#E2E4E8]">
								{recentMarkets.map((m) => (
									<div
										key={m}
										onClick={() => {
											setMarket(m);
											setShowMarketDropdown(false);
										}}
										className="h-[40px] px-3 flex items-center cursor-pointer hover:bg-[#F3F4F6] text-[#1A1D23]"
									>
										{m}
									</div>
								))}
								<div className="text-center text-xs italic text-[#9CA3AF] py-2 border-t border-[#E2E4E8]">
									or type to add new...
								</div>
							</div>
						)}
					</div>

					{/* Number of Cattle */}
					<div>
						<label className="flex items-center text-sm font-medium text-[#6B7280] tracking-[0.01em] mb-2">
							📦 Number of Cattle{" "}
							<span className="text-[#DC2626] ml-0.5">*</span>
						</label>
						<div className="flex items-center">
							<input
								type="number"
								value={cattleCount}
								onChange={(e) => setCattleCount(e.target.value)}
								min="1"
								className="w-[120px] h-[44px] bg-[#F8F9FA] border border-[#E2E4E8] rounded-md px-3 text-base text-[#1A1D23] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent"
							/>
							<span className="ml-3 text-sm text-[#6B7280]">heads</span>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="px-5 py-5 flex justify-end items-center border-t border-[#E2E4E8] bg-white rounded-b-lg">
					<button className="h-[44px] px-6 text-base font-medium text-[#6B7280] bg-transparent border border-[#E2E4E8] rounded-md hover:bg-[#F8F9FA] hover:text-[#1A1D23] hover:border-[#9CA3AF] transition-colors">
						Cancel
					</button>
					<button
						onClick={handleNext}
						disabled={!isFormValid}
						className="ml-3 h-[44px] px-7 flex items-center text-base font-medium text-white bg-[#2C5F4F] rounded-md hover:bg-[#1F4436] active:bg-[#163228] transition-colors disabled:bg-[#E2E4E8] disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
					>
						Next: Enter Details →
					</button>
				</div>
			</div>
		</div>
	);
};

export default PurchaseSetupModal;
