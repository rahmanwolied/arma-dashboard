/**
 * Sale Detail View Component
 * Displays comprehensive read-only view of a sale transaction
 */

import Link from "next/link";
import {
	ShoppingCart,
	User,
	Phone,
	Mail,
	MapPin,
	Calendar,
	CreditCard,
	Tag,
	Weight,
	Receipt,
	FileText,
	Pencil,
	CheckCircle2,
	Clock,
	AlertCircle,
	Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableFooter,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { SaleDetailData } from "../types";
import { formatCurrency } from "../helpers/calculations";
import { RecordPaymentDialog } from "./record-payment-dialog";

interface SaleDetailViewProps {
	sale: SaleDetailData;
	transactionId: string;
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
	CASH: "Cash",
	CREDIT_CARD: "Credit Card",
	BANK_TRANSFER: "Bank Transfer",
	MOBILE_MONEY: "Bkash",
};

const DISCOUNT_TYPE_LABELS: Record<string, string> = {
	FLAT: "Flat Discount",
	PERCENT: "Percentage Discount",
	WEIGHT_BASED: "Weight-Based Discount",
};

function getPaymentStatus(amountPaid: number, finalAmount: number) {
	if (amountPaid >= finalAmount) {
		return { label: "Paid", variant: "default" as const, icon: CheckCircle2 };
	}
	if (amountPaid > 0) {
		return { label: "Partial", variant: "secondary" as const, icon: Clock };
	}
	return {
		label: "Unpaid",
		variant: "destructive" as const,
		icon: AlertCircle,
	};
}

export default function SaleDetailView({
	sale,
	transactionId,
}: SaleDetailViewProps) {
	// Use stored amounts from database (more accurate than recalculating)
	const storedAmounts = sale.storedAmounts;

	// Calculate total weight from animals
	const totalWeight = sale.animals.reduce(
		(sum, animal) => sum + animal.liveWeight,
		0,
	);

	// Get price per kg with fallback to 0 for fixed pricing modes
	const pricePerKg = sale.pricePerKg || 0;

	// Use stored values if available, otherwise calculate
	const totalAmount = storedAmounts?.totalAmount ?? totalWeight * pricePerKg;
	const discountAmount = storedAmounts?.discountAmount ?? 0;
	const finalAmount = totalAmount - discountAmount;
	const amountPaid =
		storedAmounts?.amountPaid ??
		sale.payments?.reduce((sum, p) => sum + (Number(p.paidAmount) || 0), 0) ??
		0;
	const amountDue =
		storedAmounts?.amountDue ?? finalAmount - amountPaid;
	const invoiceNumber = storedAmounts?.invoiceNumber;
	const hasOverpayment = amountDue < 0;
	const overpaymentAmount = hasOverpayment ? Math.abs(amountDue) : 0;

	const paymentStatus = getPaymentStatus(amountPaid, finalAmount);
	const StatusIcon = paymentStatus.icon;

	const saleDate =
		sale.saleDate instanceof Date
			? sale.saleDate
			: new Date(sale.saleDate || Date.now());

	return (
		<div className="mx-auto w-full max-w-4xl space-y-6">
			{/* Header */}
			<Card className="border-none bg-gradient-to-br from-primary/5 via-background to-background shadow-sm">
				<CardHeader className="pb-4">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div className="space-y-2">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
									<ShoppingCart className="h-5 w-5 text-primary" />
								</div>
								<div>
									<CardTitle className="text-2xl font-bold tracking-tight">
										Sale Details
									</CardTitle>
									<p className="text-sm text-muted-foreground">
										{invoiceNumber ||
											`Transaction #${transactionId.slice(0, 8)}...`}
									</p>
								</div>
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<Badge
								variant={paymentStatus.variant}
								className="flex items-center gap-1.5 px-3 py-1"
							>
								<StatusIcon className="h-3.5 w-3.5" />
								{paymentStatus.label}
							</Badge>
							<Button variant="outline" size="sm" asChild>
								<Link href={`/dashboard/transactions/${transactionId}/edit`}>
									<Pencil className="mr-1.5 h-3.5 w-3.5" />
									Edit
								</Link>
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Calendar className="h-4 w-4" />
						<span>
							{saleDate.toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</span>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Customer Info */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-base font-semibold">
							<User className="h-4 w-4 text-primary" />
							Customer Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="flex items-start gap-3">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
									<User className="h-4 w-4 text-primary" />
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Name</p>
									<p className="font-medium">{sale.customer.name}</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
									<Phone className="h-4 w-4 text-blue-500" />
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Phone</p>
									<p className="font-medium">{sale.customer.phone}</p>
								</div>
							</div>

							{sale.customer.email && (
								<div className="flex items-start gap-3">
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/10">
										<Mail className="h-4 w-4 text-violet-500" />
									</div>
									<div>
										<p className="text-xs text-muted-foreground">Email</p>
										<p className="font-medium">{sale.customer.email}</p>
									</div>
								</div>
							)}

							{sale.customer.address && (
								<div className="flex items-start gap-3">
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
										<MapPin className="h-4 w-4 text-emerald-500" />
									</div>
									<div>
										<p className="text-xs text-muted-foreground">Address</p>
										<p className="font-medium">
											{[
												sale.customer.address.addressLine,
												sale.customer.address.zoneName,
												sale.customer.address.districtName,
												sale.customer.address.divisionName,
											]
												.filter(Boolean)
												.join(", ")}
										</p>
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Pricing Summary */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-base font-semibold">
							<Receipt className="h-4 w-4 text-primary" />
							Pricing Summary
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{pricePerKg > 0 && (
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Price per kg</span>
									<span className="font-medium">
										{formatCurrency(pricePerKg)}/kg
									</span>
								</div>
							)}
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">
									Total Weight ({sale.animals.length} animals)
								</span>
								<span className="font-medium">{totalWeight.toFixed(2)} kg</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Subtotal</span>
								<span className="font-medium">
									{formatCurrency(totalAmount)}
								</span>
							</div>

							{discountAmount > 0 && (
								<>
									<Separator />
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">
											{sale.discountType
												? DISCOUNT_TYPE_LABELS[sale.discountType]
												: "Discount"}
											{sale.discountType === "PERCENT" &&
												sale.discountInput &&
												` (${sale.discountInput}%)`}
											{sale.discountType === "WEIGHT_BASED" &&
												sale.discountInput &&
												` (${sale.discountInput} kg)`}
										</span>
										<span className="font-medium text-red-500">
											-{formatCurrency(discountAmount)}
										</span>
									</div>
								</>
							)}

							<Separator />
							<div className="flex justify-between">
								<span className="font-semibold">Final Amount</span>
								<span className="text-lg font-bold text-primary">
									{formatCurrency(finalAmount)}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Animals Table */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-base font-semibold">
						<Tag className="h-4 w-4 text-primary" />
						Animals in Sale
						<Badge variant="secondary" className="ml-2">
							{sale.animals.length}
						</Badge>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/50">
									<TableHead className="w-16">#</TableHead>
									<TableHead>Tag Number</TableHead>
									<TableHead className="text-right">
										<div className="flex items-center justify-end gap-1">
											<Weight className="h-3.5 w-3.5" />
											Weight (kg)
										</div>
									</TableHead>
									<TableHead className="text-right">Line Total</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sale.animals.map((animal, index) => (
									<TableRow key={animal.id}>
										<TableCell className="font-medium text-muted-foreground">
											{index + 1}
										</TableCell>
										<TableCell>
											<span className="font-mono text-sm">
												{animal.tagNumber}
											</span>
										</TableCell>
										<TableCell className="text-right">
											{animal.liveWeight.toFixed(2)}
										</TableCell>
										<TableCell className="text-right font-medium">
											{formatCurrency(
												animal.fixedSalePrice || animal.liveWeight * pricePerKg,
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
							<TableFooter>
								<TableRow className="bg-muted/30">
									<TableCell colSpan={2} className="font-semibold">
										Total
									</TableCell>
									<TableCell className="text-right font-semibold">
										{totalWeight.toFixed(2)} kg
									</TableCell>
									<TableCell className="text-right font-semibold">
										{formatCurrency(totalAmount)}
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Payments & Financial Summary */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Payments */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-base font-semibold">
							<CreditCard className="h-4 w-4 text-primary" />
							Payments
							{sale.payments && sale.payments.length > 0 && (
								<Badge variant="secondary" className="ml-2">
									{sale.payments.length}
								</Badge>
							)}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{sale.payments && sale.payments.length > 0 ? (
							<div className="space-y-3">
								{sale.payments.map((payment, index) => (
									<div
										key={index}
										className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
									>
										<div className="flex items-center gap-3">
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
												<CreditCard className="h-4 w-4 text-primary" />
											</div>
											<span className="font-medium">
												{PAYMENT_METHOD_LABELS[payment.paymentMethod] ||
													payment.paymentMethod}
											</span>
										</div>
										<span className="font-semibold text-green-600">
											{formatCurrency(Number(payment.paidAmount))}
										</span>
									</div>
								))}
								<Separator />
								<div className="flex justify-between font-semibold">
									<span>Total Paid</span>
									<span className="text-green-600">
										{formatCurrency(amountPaid)}
									</span>
								</div>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
								<CreditCard className="mb-2 h-8 w-8 text-muted-foreground/50" />
								<p className="text-sm text-muted-foreground">
									No payments recorded
								</p>
								<p className="text-xs text-muted-foreground">
									This is a full credit sale
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Financial Summary */}
				<Card
					className={cn(
						"border-2",
						hasOverpayment
							? "border-blue-500/20"
							: amountDue > 0
								? "border-amber-500/20"
								: "border-green-500/20",
					)}
				>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-base font-semibold">
							<Receipt className="h-4 w-4 text-primary" />
							Financial Summary
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="grid gap-3">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Final Amount</span>
									<span className="font-semibold">
										{formatCurrency(finalAmount)}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Amount Paid</span>
									<span
										className={cn(
											"font-semibold",
											amountPaid >= finalAmount
												? "text-green-600"
												: amountPaid > 0
													? "text-amber-600"
													: "text-muted-foreground",
										)}
									>
										{formatCurrency(amountPaid)}
									</span>
								</div>
								<Separator />

								{/* Show either Amount Due or Overpayment */}
								{hasOverpayment ? (
									<div className="flex justify-between">
										<span className="font-semibold text-blue-600">
											Overpayment
										</span>
										<span className="text-lg font-bold text-blue-600">
											{formatCurrency(overpaymentAmount)}
										</span>
									</div>
								) : (
									<div className="flex justify-between">
										<span className="font-semibold">Amount Due</span>
										<span
											className={cn(
												"text-lg font-bold",
												amountDue > 0 ? "text-amber-600" : "text-green-600",
											)}
										>
											{formatCurrency(amountDue)}
											{amountDue === 0 && (
												<CheckCircle2 className="ml-1 inline h-4 w-4" />
											)}
										</span>
									</div>
								)}
							</div>

							{/* Outstanding Balance */}
							{amountDue > 0 && (
								<div className="space-y-3">
									<div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/50">
										<div className="flex items-start gap-2">
											<AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
											<div className="text-xs text-amber-700 dark:text-amber-300">
												<p className="font-medium">Outstanding Balance</p>
												<p className="mt-0.5 opacity-80">
													{formatCurrency(amountDue)} remaining to be collected
												</p>
											</div>
										</div>
									</div>
									<RecordPaymentDialog
										saleId={transactionId}
										amountDue={amountDue}
									>
										<Button className="w-full" size="sm">
											<CreditCard className="mr-2 h-4 w-4" />
											Record Payment
										</Button>
									</RecordPaymentDialog>
								</div>
							)}

							{/* Fully Paid */}
							{amountDue === 0 && !hasOverpayment && (
								<div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/50">
									<div className="flex items-start gap-2">
										<CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
										<div className="text-xs text-green-700 dark:text-green-300">
											<p className="font-medium">Fully Paid</p>
											<p className="mt-0.5 opacity-80">
												This sale has been completely paid
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Overpayment Notice */}
							{hasOverpayment && (
								<div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/50">
									<div className="flex items-start gap-2">
										<Info className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
										<div className="text-xs text-blue-700 dark:text-blue-300">
											<p className="font-medium">Customer Overpayment</p>
											<p className="mt-0.5 opacity-80">
												Customer has overpaid by {formatCurrency(overpaymentAmount)}. This has been recorded as credit.
											</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Payment Terms & Remarks */}
			{(sale.paymentTerms || sale.remarks) && (
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-base font-semibold">
							<FileText className="h-4 w-4 text-primary" />
							Additional Information
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 sm:grid-cols-2">
							{sale.paymentTerms && (
								<div className="space-y-1.5">
									<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
										Payment Terms
									</p>
									<p className="rounded-lg bg-muted/50 p-3 text-sm">
										{sale.paymentTerms}
									</p>
								</div>
							)}
							{sale.remarks && (
								<div className="space-y-1.5">
									<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
										Remarks
									</p>
									<p className="rounded-lg bg-muted/50 p-3 text-sm">
										{sale.remarks}
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
