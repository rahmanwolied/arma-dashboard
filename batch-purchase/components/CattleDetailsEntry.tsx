import React, { useState, useRef, useEffect } from "react";
import { PurchaseData, Cattle } from "../types";
import CloseIcon from "../../src/features/cattle/batch-purchase/icons/CloseIcon";
import ChevronDownIcon from "../../src/features/cattle/batch-purchase/icons/ChevronDownIcon";

interface Props {
	purchaseData: PurchaseData;
	updatePurchaseData: (data: Partial<PurchaseData>) => void;
	onNext: () => void;
	onBack: () => void;
	onClose: () => void;
}

const formatIndianCurrency = (value: string): string => {
	if (!value) return "";
	const num = Number(value);
	if (isNaN(num)) return "";
	return new Intl.NumberFormat("en-IN").format(num);
};

const CattleDetailsEntry: React.FC<Props> = ({
	purchaseData,
	updatePurchaseData,
	onNext,
	onBack,
	onClose,
}) => {
	const [cattleList, setCattleList] = useState<Cattle[]>(purchaseData.cattle);
	const [error, setError] = useState("");
	const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

	useEffect(() => {
		inputRefs.current = Array(cattleList.length)
			.fill(0)
			.map(() => []);
		// Focus the first editable input on load
		inputRefs.current[0]?.[0]?.focus();
	}, [cattleList.length]);

	const handleInputChange = (
		index: number,
		field: keyof Cattle,
		value: string,
	) => {
		const updatedList = [...cattleList];
		let processedValue = value;

		if (field === "purchasePrice") {
			processedValue = value.replace(/[^0-9]/g, "");
		}

		updatedList[index] = { ...updatedList[index], [field]: processedValue };
		setCattleList(updatedList);
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		rowIndex: number,
		colIndex: number,
	) => {
		// Shift + 0 shortcut for purchase price
		if (colIndex === 1 && e.key === ")") {
			// ')' is Shift+0 on many keyboards
			e.preventDefault();
			const currentValue = cattleList[rowIndex].purchasePrice || "";
			const newValue = `${currentValue}000`;
			handleInputChange(rowIndex, "purchasePrice", newValue);
			return;
		}

		const totalRows = cattleList.length;
		const totalCols = 2; // 0: weight, 1: purchasePrice

		const moveFocus = (nextRow: number, nextCol: number) => {
			if (
				nextRow >= 0 &&
				nextRow < totalRows &&
				nextCol >= 0 &&
				nextCol < totalCols
			) {
				const targetInput = inputRefs.current[nextRow]?.[nextCol];
				if (targetInput) {
					targetInput.focus();
					targetInput.select();
				}
			}
		};

		switch (e.key) {
			case "Enter":
			case "Tab": {
				e.preventDefault();
				let nextCol = colIndex + 1;
				let nextRow = rowIndex;
				if (nextCol >= totalCols) {
					nextCol = 0; // Move to weight column
					nextRow = rowIndex + 1;
				}
				moveFocus(nextRow, nextCol);
				break;
			}
			case "ArrowUp":
				e.preventDefault();
				moveFocus(rowIndex - 1, colIndex);
				break;
			case "ArrowDown":
				e.preventDefault();
				moveFocus(rowIndex + 1, colIndex);
				break;
			case "ArrowLeft":
				e.preventDefault();
				moveFocus(rowIndex, colIndex - 1);
				break;
			case "ArrowRight":
				e.preventDefault();
				moveFocus(rowIndex, colIndex + 1);
				break;
			default:
				break;
		}
	};

	const handleNext = () => {
		// Validation for duplicate tags is no longer needed.
		setError("");
		updatePurchaseData({ cattle: cattleList });
		onNext();
	};

	const isPriceOutOfRange = (priceStr: string): boolean => {
		if (!priceStr) return false;
		const price = parseFloat(priceStr);
		return price < 10000 || price > 200000;
	};

	return (
		<div className="p-4 md:p-8 max-w-[1200px] mx-auto">
			<div className="bg-white rounded-t-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
				{/* Header */}
				<div className="h-[72px] px-6 flex items-center justify-between">
					<h1 className="text-lg font-semibold text-[#1A1D23] tracking-[-0.01em]">
						CATTLE PURCHASE - {purchaseData.purchaseDate} at{" "}
						{purchaseData.marketName}
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

				{/* Progress */}
				<div className="px-6 py-4 border-b border-[#E2E4E8] flex justify-between items-center">
					<p className="text-sm text-[#6B7280]">
						📋 Enter details for {purchaseData.numberOfCattle} cattle
					</p>
					<div className="bg-[#F3F4F6] px-3 py-1 rounded-md text-sm font-medium text-[#1A1D23] flex items-center">
						Row 1 of {purchaseData.numberOfCattle}{" "}
						<ChevronDownIcon className="ml-2 w-4 h-4 text-[#6B7280]" />
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="bg-white rounded-b-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 overflow-x-auto">
				<table className="min-w-[480px] w-full border-collapse">
					<thead>
						<tr className="bg-[#F8F9FA] h-[44px] border-b-2 border-[#E2E4E8]">
							<th className="px-3 text-left text-sm font-semibold text-[#1A1D23] w-[120px]">
								🏷️ Tag No.
							</th>
							<th className="px-3 text-left text-sm font-semibold text-[#1A1D23] w-[160px]">
								⚖️ Weight (kg)
							</th>
							<th className="px-3 text-left text-sm font-semibold text-[#1A1D23] w-[200px]">
								💰 Purchase Price (৳)
							</th>
						</tr>
					</thead>
					<tbody>
						{cattleList.map((cattle, index) => (
							<tr
								key={cattle.id}
								className={`h-[52px] border-b border-[#E2E4E8] transition-colors duration-200 ${isPriceOutOfRange(cattle.purchasePrice) ? "bg-yellow-100 hover:bg-yellow-200" : "hover:bg-[#F8F9FA]"}`}
							>
								<td className="p-2">
									<input
										type="text"
										value={cattle.tagNo}
										className="table-input bg-gray-200 cursor-default"
										readOnly
									/>
								</td>
								<td className="p-2">
									<input
										type="number"
										value={cattle.weight}
										onChange={(e) =>
											handleInputChange(index, "weight", e.target.value)
										}
										onKeyDown={(e) => handleKeyDown(e, index, 0)}
										ref={(el) => {
											if (inputRefs.current[index])
												inputRefs.current[index][0] = el;
										}}
										className="table-input"
										placeholder="____"
									/>
								</td>
								<td className="p-2">
									<input
										type="text"
										value={formatIndianCurrency(cattle.purchasePrice)}
										onChange={(e) =>
											handleInputChange(index, "purchasePrice", e.target.value)
										}
										onKeyDown={(e) => handleKeyDown(e, index, 1)}
										ref={(el) => {
											if (inputRefs.current[index])
												inputRefs.current[index][1] = el;
										}}
										className="table-input"
										placeholder="____"
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Error Display */}
			{error && (
				<div className="mt-4 bg-[#FEE2E2] border border-[#FCA5A5] border-l-4 border-l-[#DC2626] rounded-md p-3 flex items-center">
					<span className="text-[#DC2626]">⚠️</span>
					<p className="ml-2 text-sm text-[#991B1B]">{error}</p>
				</div>
			)}

			{/* Action Bar */}
			<div className="mt-8 bg-white border-t border-[#E2E4E8] py-5 px-8 flex justify-between items-center shadow-[0_-2px_8px_rgba(0,0,0,0.06)] sticky bottom-0">
				<button className="h-[44px] px-6 text-base font-medium text-[#6B7280] bg-transparent border border-[#E2E4E8] rounded-md hover:bg-[#F8F9FA] hover:text-[#1A1D23] hover:border-[#9CA3AF] transition-colors">
					Save Draft
				</button>
				<div className="flex items-center">
					<button
						onClick={onBack}
						className="h-[44px] px-6 text-base font-medium text-[#6B7280] bg-transparent border border-[#E2E4E8] rounded-md hover:bg-[#F8F9FA] hover:text-[#1A1D23] hover:border-[#9CA3AF] transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={handleNext}
						className="ml-3 h-[44px] px-7 flex items-center text-base font-medium text-white bg-[#2C5F4F] rounded-md hover:bg-[#1F4436] active:bg-[#163228] transition-colors"
					>
						Next: Batch Costs →
					</button>
				</div>
			</div>
			<style>{`
                .table-input {
                    width: 100%;
                    height: 36px;
                    background-color: #F8F9FA;
                    border: 1px solid #E2E4E8;
                    border-radius: 4px;
                    padding: 0 8px;
                    font-size: 14px;
                    color: #1A1D23;
                }
                .table-input:focus {
                    outline: none;
                    border: 2px solid #2C5F4F;
                    background-color: white;
                }
                .table-input::placeholder {
                    text-align: right;
                    color: #D1D5DB;
                }
            `}</style>
		</div>
	);
};

export default CattleDetailsEntry;
