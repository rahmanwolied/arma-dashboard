/**
 * Sale Details Section
 * Handles pricing mode, price inputs, and sale date
 */

import {
	DollarSign,
	Calendar,
	Scale,
	Banknote,
	Tag,
	Users,
	Calculator,
	Layers,
	CheckCircle2,
} from "lucide-react";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import type { FormSectionProps } from "./types";

// Custom toggle card component for better visual feedback
function ToggleCard({
	isSelected,
	onClick,
	icon: Icon,
	title,
	description,
	disabled,
}: {
	isSelected: boolean;
	onClick: () => void;
	icon: React.ElementType;
	title: string;
	description: string;
	disabled?: boolean;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"relative flex flex-1 flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all duration-200",
				"hover:border-primary/50 hover:bg-primary/5",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
				isSelected
					? "border-primary bg-primary/10 shadow-sm"
					: "border-muted-foreground/20 bg-card",
				disabled && "cursor-not-allowed opacity-50",
			)}
		>
			{isSelected && (
				<div className="absolute right-2 top-2">
					<CheckCircle2 className="h-5 w-5 text-primary" />
				</div>
			)}
			<div
				className={cn(
					"flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
					isSelected
						? "bg-primary text-primary-foreground"
						: "bg-muted text-muted-foreground",
				)}
			>
				<Icon className="h-5 w-5" />
			</div>
			<div className="space-y-1 pr-6">
				<h4
					className={cn(
						"font-semibold transition-colors",
						isSelected ? "text-primary" : "text-foreground",
					)}
				>
					{title}
				</h4>
				<p className="text-xs text-muted-foreground">{description}</p>
			</div>
		</button>
	);
}

// Sub-mode toggle for secondary selection
function SubModeToggle({
	isSelected,
	onClick,
	icon: Icon,
	label,
}: {
	isSelected: boolean;
	onClick: () => void;
	icon: React.ElementType;
	label: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-all duration-150",
				"hover:border-primary/50 hover:bg-primary/5",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
				isSelected
					? "border-primary bg-primary/10 text-primary"
					: "border-muted-foreground/30 bg-background text-muted-foreground",
			)}
		>
			<Icon
				className={cn(
					"h-4 w-4 transition-colors",
					isSelected ? "text-primary" : "text-muted-foreground",
				)}
			/>
			{label}
			{isSelected && <CheckCircle2 className="ml-1 h-3.5 w-3.5" />}
		</button>
	);
}

export function SaleDetailsSection({ form }: FormSectionProps) {
	const pricingMode = form.watch("pricingMode");
	const perKgMode = form.watch("perKgMode") || "SAME_RATE";
	const fixedPriceMode = form.watch("fixedPriceMode");
	const animals = form.watch("animals") || [];

	// Calculate totals for per-animal modes
	const { totalFixedSalePrice, totalPerKgAmount } = useMemo(() => {
		let fixedTotal = 0;
		let perKgTotal = 0;

		for (const animal of animals) {
			fixedTotal += animal.fixedSalePrice || 0;
			perKgTotal += (animal.individualPricePerKg || 0) * animal.liveWeight;
		}

		return {
			totalFixedSalePrice: fixedTotal,
			totalPerKgAmount: perKgTotal,
		};
	}, [animals]);

	// Handler to update individual animal fixed price
	const handleAnimalFixedPriceChange = (
		animalId: string,
		price: number | undefined,
	) => {
		const currentAnimals = form.getValues("animals") || [];
		const updatedAnimals = currentAnimals.map((animal) =>
			animal.id === animalId ? { ...animal, fixedSalePrice: price } : animal,
		);
		form.setValue("animals", updatedAnimals);
	};

	// Handler to update individual animal price per kg
	const handleAnimalPricePerKgChange = (
		animalId: string,
		pricePerKg: number | undefined,
	) => {
		const currentAnimals = form.getValues("animals") || [];
		const updatedAnimals = currentAnimals.map((animal) =>
			animal.id === animalId
				? { ...animal, individualPricePerKg: pricePerKg }
				: animal,
		);
		form.setValue("animals", updatedAnimals);
	};

	// Handlers for pricing mode changes
	const handlePricingModeChange = (value: "PER_KG" | "FIXED") => {
		form.setValue("pricingMode", value);
		if (value === "PER_KG") {
			form.setValue("fixedPriceMode", undefined);
			form.setValue("totalFixedPrice", undefined);
			form.setValue("perKgMode", "SAME_RATE");
		} else {
			form.setValue("pricePerKg", undefined);
			form.setValue("perKgMode", undefined);
			form.setValue("fixedPriceMode", "TOTAL");
		}
	};

	const handlePerKgModeChange = (value: "SAME_RATE" | "PER_ANIMAL") => {
		form.setValue("perKgMode", value);
		if (value === "PER_ANIMAL") {
			form.setValue("pricePerKg", undefined);
		}
	};

	const handleFixedPriceModeChange = (value: "TOTAL" | "PER_ANIMAL") => {
		form.setValue("fixedPriceMode", value);
		if (value === "PER_ANIMAL") {
			form.setValue("totalFixedPrice", undefined);
		}
	};

	return (
		<div className="space-y-6 rounded-lg border bg-accent p-4">
			<h3 className="flex items-center gap-2 text-lg font-semibold">
				<DollarSign className="h-5 w-5" />
				Sale Details
			</h3>

			{/* Pricing Mode Selection */}
			<div className="space-y-3">
				<Label className="text-sm font-medium">Pricing Method</Label>
				<div className="flex flex-col gap-3 sm:flex-row">
					<ToggleCard
						isSelected={pricingMode === "PER_KG"}
						onClick={() => handlePricingModeChange("PER_KG")}
						icon={Scale}
						title="Per Kilogram"
						description="Price calculated based on animal weight"
					/>
					<ToggleCard
						isSelected={pricingMode === "FIXED"}
						onClick={() => handlePricingModeChange("FIXED")}
						icon={Banknote}
						title="Fixed Amount"
						description="Set a fixed price regardless of weight"
					/>
				</div>
				<FormField
					control={form.control}
					name="pricingMode"
					render={() => (
						<FormItem>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Per KG Pricing Options */}
			{pricingMode === "PER_KG" && (
				<div
					className={cn(
						"space-y-4 rounded-lg border-l-4 border-primary/50 bg-card p-4",
						"animate-in fade-in-50 slide-in-from-top-2 duration-200",
					)}
				>
					{/* Per KG Mode Selection */}
					<div className="space-y-3">
						<Label className="text-sm font-medium">Rate Type</Label>
						<div className="flex flex-wrap gap-2">
							<SubModeToggle
								isSelected={perKgMode === "SAME_RATE"}
								onClick={() => handlePerKgModeChange("SAME_RATE")}
								icon={Calculator}
								label="Same Rate"
							/>
							<SubModeToggle
								isSelected={perKgMode === "PER_ANIMAL"}
								onClick={() => handlePerKgModeChange("PER_ANIMAL")}
								icon={Users}
								label="Individual Rates"
							/>
						</div>
						<FormField
							control={form.control}
							name="perKgMode"
							render={() => (
								<FormItem>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Same Rate Input */}
					{perKgMode === "SAME_RATE" && (
						<div className="animate-in fade-in-50 slide-in-from-left-2 duration-150">
							<FormField
								control={form.control}
								name="pricePerKg"
								render={({ field }) => (
									<FormItem className="max-w-sm">
										<FormLabel>Price per KG (৳)</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												placeholder="Enter price per kg"
												{...field}
												value={field.value ?? ""}
											/>
										</FormControl>
										<FormDescription>
											All animals will be priced at this rate
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}

					{/* Per Animal Price Per KG Inputs */}
					{perKgMode === "PER_ANIMAL" && (
						<div className="space-y-3 animate-in fade-in-50 slide-in-from-left-2 duration-150">
							<Label className="text-sm font-medium">
								Individual Price per KG
							</Label>
							{animals.length === 0 ? (
								<div className="rounded-md border border-dashed border-muted-foreground/50 bg-muted/50 p-4 text-center">
									<Tag className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
									<p className="text-sm text-muted-foreground">
										No animals selected yet
									</p>
									<p className="text-xs text-muted-foreground">
										Select animals above to set individual rates
									</p>
								</div>
							) : (
								<div className="space-y-2">
									{animals.map((animal, index) => {
										const calculatedPrice =
											(animal.individualPricePerKg || 0) * animal.liveWeight;
										return (
											<div
												key={animal.id}
												className="flex items-center gap-3 rounded-lg border bg-background p-3 animate-in fade-in-50 duration-150"
												style={{ animationDelay: `${index * 50}ms` }}
											>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2">
														<span className="font-semibold text-sm">
															{animal.tagNumber}
														</span>
														<span className="text-xs text-muted-foreground">
															{animal.liveWeight} kg
														</span>
													</div>
													{animal.adjustedPrice && animal.adjustedPrice > 0 && (
														<span className="text-xs text-muted-foreground">
															Cost: ৳{animal.adjustedPrice.toLocaleString()}
														</span>
													)}
												</div>
												<div className="flex items-center gap-2">
													<div className="relative">
														<span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
															৳
														</span>
														<Input
															type="number"
															step="0.01"
															placeholder="Rate/kg"
															value={animal.individualPricePerKg ?? ""}
															onChange={(e) => {
																const val = e.target.value;
																handleAnimalPricePerKgChange(
																	animal.id,
																	val === "" ? undefined : Number(val),
																);
															}}
															className="w-28 pl-7 text-right"
														/>
													</div>
													<span className="text-xs text-muted-foreground w-24 text-right">
														= ৳{calculatedPrice.toLocaleString()}
													</span>
												</div>
											</div>
										);
									})}

									{/* Total Summary */}
									<div className="rounded-md border-2 border-primary/20 bg-primary/5 p-3 mt-3">
										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">
												Total Sale Price
											</span>
											<span className="font-bold text-lg text-primary">
												৳{totalPerKgAmount.toLocaleString()}
											</span>
										</div>
									</div>
								</div>
							)}
							<FormField
								control={form.control}
								name="animals"
								render={() => (
									<FormItem>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}
				</div>
			)}

			{/* Fixed Price Options */}
			{pricingMode === "FIXED" && (
				<div
					className={cn(
						"space-y-4 rounded-lg border-l-4 border-primary/50 bg-card p-4",
						"animate-in fade-in-50 slide-in-from-top-2 duration-200",
					)}
				>
					{/* Fixed Price Mode Selection */}
					<div className="space-y-3">
						<Label className="text-sm font-medium">Fixed Price Type</Label>
						<div className="flex flex-wrap gap-2">
							<SubModeToggle
								isSelected={fixedPriceMode === "TOTAL"}
								onClick={() => handleFixedPriceModeChange("TOTAL")}
								icon={Layers}
								label="Total Amount"
							/>
							<SubModeToggle
								isSelected={fixedPriceMode === "PER_ANIMAL"}
								onClick={() => handleFixedPriceModeChange("PER_ANIMAL")}
								icon={Users}
								label="Per Animal"
							/>
						</div>
						<FormField
							control={form.control}
							name="fixedPriceMode"
							render={() => (
								<FormItem>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Total Fixed Price Input */}
					{fixedPriceMode === "TOTAL" && (
						<div className="animate-in fade-in-50 slide-in-from-left-2 duration-150">
							<FormField
								control={form.control}
								name="totalFixedPrice"
								render={({ field }) => (
									<FormItem className="max-w-sm">
										<FormLabel>Total Fixed Price (৳)</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="1"
												placeholder="Enter total amount for all animals"
												{...field}
												value={field.value ?? ""}
											/>
										</FormControl>
										<FormDescription>
											This amount applies to all selected animals combined
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}

					{/* Per Animal Fixed Price Inputs */}
					{fixedPriceMode === "PER_ANIMAL" && (
						<div className="space-y-3 animate-in fade-in-50 slide-in-from-left-2 duration-150">
							<Label className="text-sm font-medium">
								Individual Animal Prices
							</Label>
							{animals.length === 0 ? (
								<div className="rounded-md border border-dashed border-muted-foreground/50 bg-muted/50 p-4 text-center">
									<Tag className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
									<p className="text-sm text-muted-foreground">
										No animals selected yet
									</p>
									<p className="text-xs text-muted-foreground">
										Select animals above to set individual prices
									</p>
								</div>
							) : (
								<div className="space-y-2">
									{animals.map((animal, index) => (
										<div
											key={animal.id}
											className="flex items-center gap-3 rounded-lg border bg-background p-3 animate-in fade-in-50 duration-150"
											style={{ animationDelay: `${index * 50}ms` }}
										>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<span className="font-semibold text-sm">
														{animal.tagNumber}
													</span>
													<span className="text-xs text-muted-foreground">
														{animal.liveWeight} kg
													</span>
												</div>
												{animal.adjustedPrice && animal.adjustedPrice > 0 && (
													<span className="text-xs text-muted-foreground">
														Cost: ৳{animal.adjustedPrice.toLocaleString()}
													</span>
												)}
											</div>
											<div className="relative">
												<span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
													৳
												</span>
												<Input
													type="number"
													step="1"
													placeholder="Price"
													value={animal.fixedSalePrice ?? ""}
													onChange={(e) => {
														const val = e.target.value;
														handleAnimalFixedPriceChange(
															animal.id,
															val === "" ? undefined : Number(val),
														);
													}}
													className="w-36 pl-7 text-right"
												/>
											</div>
										</div>
									))}

									{/* Total Summary */}
									<div className="rounded-md border-2 border-primary/20 bg-primary/5 p-3 mt-3">
										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">
												Total Sale Price
											</span>
											<span className="font-bold text-lg text-primary">
												৳{totalFixedSalePrice.toLocaleString()}
											</span>
										</div>
									</div>
								</div>
							)}
							<FormField
								control={form.control}
								name="animals"
								render={() => (
									<FormItem>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}
				</div>
			)}

			{/* Sale Date - Always Visible */}
			<FormField
				control={form.control}
				name="saleDate"
				render={({ field }) => (
					<FormItem className="max-w-sm">
						<FormLabel className="flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							Sale Date
						</FormLabel>
						<FormControl>
							<Input
								type="date"
								{...field}
								value={
									field.value instanceof Date
										? field.value.toISOString().split("T")[0]
										: field.value
								}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
