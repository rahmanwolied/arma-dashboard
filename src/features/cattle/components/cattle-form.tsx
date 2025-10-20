"use client";

import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createCattle, type FlattenedCattle } from "../actions";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const formSchema = z.object({
	image: z
		.any()
		// .refine((files) => files?.length == 1, 'Image is required.')
		// .refine(
		//   (files) => files?.[0]?.size <= MAX_FILE_SIZE,
		//   `Max file size is 3MB.`
		// )
		// .refine(
		//   (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
		//   '.jpg, .jpeg, .png and .webp files are accepted.'
		// )
		.optional(),
	name: z.string().optional(),

	liveWeight: z.string().refine((value) => {
		const num = Number(value);
		return !Number.isNaN(num) && num >= 0;
	}, "Live weight must be a positive number."),
	purchasePricePerKg: z.string().refine((value) => {
		const num = Number(value);
		return !Number.isNaN(num) && num >= 0;
	}, "Purchase price per kg must be a positive number."),
	cattleClass: z.string(),
	gender: z.string(),
	fatPercentage: z.string().optional(),
	meatPercentage: z.string().optional(),

	isVaccinated: z.boolean().optional(),
	isPregnant: z.boolean().optional(),
	isLactating: z.boolean().optional(),
	isQuarantined: z.boolean().optional(),
	isSold: z.boolean().optional(),
});

export default function CowForm({
	initialData,
	pageTitle,
}: {
	initialData: FlattenedCattle | null;
	pageTitle: string;
}) {
	const defaultValues = {
		name: initialData?.name || "",
		image: initialData?.imageUrl || [],
		liveWeight: initialData?.liveWeight?.toString() || "",
		purchasePricePerKg: initialData?.purchasePricePerKg?.toString() || "",
		cattleClass: initialData?.cattleClass || "",
		isVaccinated: initialData?.isVaccinated || false,
		isPregnant: initialData?.isPregnant || false,
		isLactating: initialData?.isLactating || false,
		isQuarantined: initialData?.isQuarantined || false,
		gender: initialData?.gender || "",
		fatPercentage: initialData?.fatPercentage?.toString() || "",
		meatPercentage: initialData?.meatPercentage?.toString() || "",
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		values: defaultValues,
	});

	const isSubmitting = form.formState.isSubmitting;
	const disabled = isSubmitting || !!initialData;

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const result = await createCattle(values);
		if (result) {
			toast.success("Cattle added successfully", {
				description: `Cattle Number: ${result.cattleNumber}`,
			});
			form.reset();
		} else {
			toast.error("Failed to add cattle", {
				description: "Failed to add cattle",
				action: {
					label: "Retry",
					onClick: () => {
						onSubmit(values);
					},
				},
			});
		}
	}

	// Calculate form completion percentage
	const formCompletion = () => {
		const fields = form.watch();
		const totalFields = 7; // Key required fields
		let filledFields = 0;
		if (fields.liveWeight) filledFields++;
		if (fields.purchasePricePerKg) filledFields++;
		if (fields.cattleClass) filledFields++;
		if (fields.gender) filledFields++;
		if (fields.fatPercentage) filledFields++;
		if (fields.meatPercentage) filledFields++;
		if (fields.name) filledFields++;
		return Math.round((filledFields / totalFields) * 100);
	};

	return (
		<Card className="mx-auto w-full max-w-4xl">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-left text-2xl font-bold">
						<Icons.cattle className="h-6 w-6" />
						{pageTitle}
					</CardTitle>
					<div className="flex items-center gap-2">
						<span className="text-muted-foreground text-sm">
							Form Completion:
						</span>
						<div className="relative h-2 w-24 overflow-hidden rounded-full bg-muted">
							<div
								className="h-full bg-green-500 transition-all duration-300"
								style={{ width: `${formCompletion()}%` }}
							/>
						</div>
						<span className="text-sm font-medium">{formCompletion()}%</span>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<div className="space-y-4">
									<FormItem className="w-full">
										<FormLabel>Images</FormLabel>
										<FormControl>
											<FileUploader
												disabled={true}
												value={field.value}
												onValueChange={field.onChange}
												maxFiles={4}
												maxSize={4 * 1024 * 1024}
												// disabled={loading}
												// progresses={progresses}
												// pass the onUpload function here for direct upload
												// onUpload={uploadFiles}
												// disabled={isUploading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>

						{/* Basic Information Section */}
						<div className="space-y-4 rounded-lg border bg-accent p-4">
							<h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
								Basic Information
							</h3>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Cattle Name (Optional)</FormLabel>
											<FormControl>
												<Input placeholder="Enter cattle name" {...field} />
											</FormControl>
											<FormDescription>
												A friendly name for easy identification
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="liveWeight"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Live Weight (KG)</FormLabel>
											<FormControl>
												<Input
													type="number"
													step="0.01"
													placeholder="Enter live weight"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Purchase & Quality Information */}
						<div className="space-y-4 rounded-lg border bg-accent p-4">
							<h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
								Purchase & Quality
							</h3>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="purchasePricePerKg"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Purchase Price (per KG)</FormLabel>
											<FormControl>
												<Input
													type="number"
													step="0.01"
													placeholder="Enter purchase price"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="cattleClass"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Cattle Class</FormLabel>
											<Select
												onValueChange={(value) => field.onChange(value)}
												value={field.value}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select cattle class" />
												</SelectTrigger>
												<FormControl>
													<SelectContent>
														<SelectItem value="GOLD">GOLD</SelectItem>
														<SelectItem value="SILVER">SILVER</SelectItem>
														<SelectItem value="PLATINUM">PLATINUM</SelectItem>
													</SelectContent>
												</FormControl>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="fatPercentage"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Fat Percentage</FormLabel>
											<FormControl>
												<Input
													type="number"
													step="0.01"
													placeholder="Enter fat percentage"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="meatPercentage"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Meat Percentage</FormLabel>
											<FormControl>
												<Input
													type="number"
													step="0.01"
													placeholder="Enter meat percentage"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Classification & Health Status */}
						<div className="space-y-4 rounded-lg border bg-accent p-4">
							<h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
								Classification & Health Status
							</h3>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
								<FormField
									control={form.control}
									name="gender"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Gender</FormLabel>
											<FormControl>
												<Select
													onValueChange={(value) => field.onChange(value)}
													value={field.value}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select gender" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="MALE">MALE</SelectItem>
														<SelectItem value="FEMALE">FEMALE</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<div>
												<FormField
													control={form.control}
													name="isVaccinated"
													render={({ field }) => (
														<FormItem>
															<FormControl>
																<div
																	className={`flex cursor-pointer items-center gap-4 rounded-md border p-3 transition-all hover:shadow-sm ${
																		field.value
																			? "border-green-300 bg-green-100 dark:border-green-500 dark:bg-green-900"
																			: "dark:bg-muted border-gray-200 bg-gray-50 dark:border-gray-500"
																	}`}
																	onClick={() => field.onChange(!field.value)}
																	onKeyUp={() => field.onChange(!field.value)}
																>
																	<Icons.isVaccinated
																		className={`h-6 w-6 ${
																			field.value
																				? "text-green-500 dark:text-green-500"
																				: "text-gray-500 dark:text-gray-500"
																		}`}
																	/>
																	<h1 className="text-sm font-medium">
																		Vaccinated
																	</h1>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p>Indicates if the animal has been vaccinated</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>

								{form.watch("gender") === "FEMALE" && (
									<>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<div>
														<FormField
															control={form.control}
															name="isPregnant"
															render={({ field }) => (
																<FormItem>
																	<FormControl>
																		<div
																			className={`flex cursor-pointer items-center gap-4 rounded-md border p-3 transition-all hover:shadow-sm ${
																				field.value
																					? "border-green-300 bg-green-100 dark:border-green-500 dark:bg-green-900"
																					: "dark:bg-muted border-gray-200 bg-gray-50 dark:border-gray-500"
																			}`}
																			onClick={() =>
																				field.onChange(!field.value)
																			}
																			onKeyUp={() =>
																				field.onChange(!field.value)
																			}
																		>
																			<Icons.isPregnant
																				className={`h-6 w-6 ${
																					field.value
																						? "text-green-500 dark:text-green-500"
																						: "text-gray-500 dark:text-gray-400"
																				}`}
																			/>
																			<h1 className="text-sm font-medium">
																				Pregnant
																			</h1>
																		</div>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
												</TooltipTrigger>
												<TooltipContent>
													<p>Female cattle that is currently pregnant</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>

										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<div>
														<FormField
															control={form.control}
															name="isLactating"
															render={({ field }) => (
																<FormItem>
																	<FormControl>
																		<div
																			className={`flex cursor-pointer items-center gap-4 rounded-md border p-3 transition-all hover:shadow-sm ${
																				field.value
																					? "border-green-300 bg-green-100 dark:border-green-500 dark:bg-green-900"
																					: "dark:bg-muted border-gray-200 bg-gray-50 dark:border-gray-500"
																			}`}
																			onClick={() =>
																				field.onChange(!field.value)
																			}
																			onKeyUp={() =>
																				field.onChange(!field.value)
																			}
																		>
																			<Icons.isLactating
																				className={`h-6 w-6 ${
																					field.value
																						? "text-green-500 dark:text-green-500"
																						: "text-gray-500 dark:text-gray-400"
																				}`}
																			/>
																			<h1 className="text-sm font-medium">
																				Lactating
																			</h1>
																		</div>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
												</TooltipTrigger>
												<TooltipContent>
													<p>Female cattle that is producing milk</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</>
								)}

								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<div>
												<FormField
													control={form.control}
													name="isQuarantined"
													render={({ field }) => (
														<FormItem>
															<FormControl>
																<div
																	className={`flex cursor-pointer items-center gap-4 rounded-md border p-3 transition-all hover:shadow-sm ${
																		field.value
																			? "border-green-300 bg-green-100 dark:border-green-500 dark:bg-green-900"
																			: "dark:bg-muted border-gray-200 bg-gray-50 dark:border-gray-500"
																	}`}
																	onClick={() => field.onChange(!field.value)}
																	onKeyUp={() => field.onChange(!field.value)}
																>
																	<Icons.isQuarantined
																		className={`h-6 w-6 ${
																			field.value
																				? "text-green-500 dark:text-green-500"
																				: "text-gray-500 dark:text-gray-400"
																		}`}
																	/>
																	<h1 className="text-sm font-medium">
																		Quarantined
																	</h1>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p>Animal is isolated for health reasons</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>

								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<div>
												<FormField
													control={form.control}
													name="isSold"
													render={({ field }) => (
														<FormItem>
															<FormControl>
																<div
																	className={`flex cursor-pointer items-center gap-4 rounded-md border p-3 transition-all hover:shadow-sm ${
																		field.value
																			? "border-green-300 bg-green-100 dark:border-green-500 dark:bg-green-900"
																			: "dark:bg-muted border-gray-200 bg-gray-50 dark:border-gray-500"
																	}`}
																	onClick={() => field.onChange(!field.value)}
																	onKeyUp={() => field.onChange(!field.value)}
																>
																	<Icons.isSold
																		className={`h-6 w-6 ${
																			field.value
																				? "text-green-500 dark:text-green-500"
																				: "text-gray-500 dark:text-gray-400"
																		}`}
																	/>
																	<h1 className="text-sm font-medium">Sold</h1>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p>Mark if the animal has been sold</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</div>

						<Separator />

						<div className="flex w-full items-center justify-between rounded-lg border bg-muted/50 p-4">
							<div className="space-y-1">
								<h1 className="text-sm font-medium text-muted-foreground">
									Estimated Total Cost
								</h1>
								<p className="text-2xl font-bold">
									{(
										Number(form.watch("purchasePricePerKg")) *
										Number(form.watch("liveWeight"))
									).toLocaleString("en-US", {
										style: "currency",
										currency: "BDT",
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
										currencyDisplay: "narrowSymbol",
									})}
								</p>
							</div>
							<Button type="submit" disabled={disabled} size="lg">
								{isSubmitting ? (
									<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Icons.cattle className="mr-2 h-4 w-4" />
								)}
								{isSubmitting ? "Saving..." : "Add Cattle"}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
