"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	CreditCard,
	Banknote,
	Building2,
	Smartphone,
	Loader2,
	CheckCircle2,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { recordPaymentAction } from "../actions/record-payment";
import type { PaymentMethod } from "../types";
import { formatCurrency } from "../helpers/calculations";

interface RecordPaymentDialogProps {
	saleId: string;
	amountDue: number;
	children: React.ReactNode;
}

const PAYMENT_METHODS: {
	value: PaymentMethod;
	label: string;
	icon: React.ElementType;
	color: string;
}[] = [
	{
		value: "CASH",
		label: "Cash",
		icon: Banknote,
		color: "text-green-600 bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800",
	},
	{
		value: "BANK_TRANSFER",
		label: "Bank Transfer",
		icon: Building2,
		color: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800",
	},
	{
		value: "MOBILE_MONEY",
		label: "Bkash",
		icon: Smartphone,
		color: "text-pink-600 bg-pink-50 border-pink-200 dark:bg-pink-950/50 dark:border-pink-800",
	},
	{
		value: "CREDIT_CARD",
		label: "Credit Card",
		icon: CreditCard,
		color: "text-violet-600 bg-violet-50 border-violet-200 dark:bg-violet-950/50 dark:border-violet-800",
	},
];

export function RecordPaymentDialog({
	saleId,
	amountDue,
	children,
}: RecordPaymentDialogProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("CASH");
	const [amount, setAmount] = useState(amountDue.toString());
	const [transactionRef, setTransactionRef] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const paymentAmount = Number.parseFloat(amount.replace(/,/g, ""));
		if (Number.isNaN(paymentAmount) || paymentAmount <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}

		if (paymentAmount > amountDue) {
			toast.error("Payment amount cannot exceed the due amount");
			return;
		}

		setIsSubmitting(true);
		try {
			const result = await recordPaymentAction({
				saleId,
				amount: paymentAmount,
				paymentMethod: selectedMethod,
				transactionReference: transactionRef || undefined,
			});

			if (result.success) {
				toast.success("Payment recorded successfully!", {
					description:
						result.data?.newAmountDue === 0
							? "This sale is now fully paid!"
							: `Remaining balance: ${formatCurrency(result.data?.newAmountDue ?? 0)}`,
				});
				setOpen(false);
				router.refresh();
			} else {
				toast.error(result.message || "Failed to record payment");
			}
		} catch (error) {
			console.error("Error recording payment:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value.replace(/,/g, "");
		if (rawValue === "" || /^\d*\.?\d*$/.test(rawValue)) {
			setAmount(rawValue);
		}
	};

	const setFullAmount = () => {
		setAmount(amountDue.toString());
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<CreditCard className="h-5 w-5 text-primary" />
						Record Payment
					</DialogTitle>
					<DialogDescription>
						Record a payment to resolve the outstanding balance of{" "}
						<span className="font-semibold text-amber-600">
							{formatCurrency(amountDue)}
						</span>
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Payment Method Selection */}
					<div className="space-y-3">
						<Label className="text-sm font-medium">Payment Method</Label>
						<div className="grid grid-cols-2 gap-2">
							{PAYMENT_METHODS.map((method) => {
								const Icon = method.icon;
								const isSelected = selectedMethod === method.value;
								return (
									<button
										key={method.value}
										type="button"
										onClick={() => setSelectedMethod(method.value)}
										className={cn(
											"flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-all",
											isSelected
												? method.color
												: "border-border bg-background hover:bg-muted/50"
										)}
									>
										<Icon
											className={cn(
												"h-5 w-5",
												isSelected ? "" : "text-muted-foreground"
											)}
										/>
										<span
											className={cn(
												"text-sm font-medium",
												isSelected ? "" : "text-muted-foreground"
											)}
										>
											{method.label}
										</span>
										{isSelected && (
											<CheckCircle2 className="ml-auto h-4 w-4" />
										)}
									</button>
								);
							})}
						</div>
					</div>

					{/* Amount Input */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="amount" className="text-sm font-medium">
								Amount
							</Label>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="h-auto px-2 py-1 text-xs text-primary"
								onClick={setFullAmount}
							>
								Pay Full Amount
							</Button>
						</div>
						<div className="relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
								৳
							</span>
							<Input
								id="amount"
								type="text"
								inputMode="decimal"
								value={amount ? Number.parseFloat(amount).toLocaleString() : ""}
								onChange={handleAmountChange}
								className="pl-8 text-lg font-semibold"
								placeholder="0"
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							Maximum: {formatCurrency(amountDue)}
						</p>
					</div>

					{/* Transaction Reference (optional) */}
					{(selectedMethod === "BANK_TRANSFER" ||
						selectedMethod === "MOBILE_MONEY") && (
						<div className="space-y-2">
							<Label
								htmlFor="transactionRef"
								className="text-sm font-medium"
							>
								Transaction Reference{" "}
								<span className="text-muted-foreground">(Optional)</span>
							</Label>
							<Input
								id="transactionRef"
								type="text"
								value={transactionRef}
								onChange={(e) => setTransactionRef(e.target.value)}
								placeholder="e.g., TXN123456789"
							/>
						</div>
					)}

					<DialogFooter className="gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Recording...
								</>
							) : (
								<>
									<CheckCircle2 className="mr-2 h-4 w-4" />
									Record Payment
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

