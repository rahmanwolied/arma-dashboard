"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatDate, formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import type { SaleWithCustomer } from "@/app/_lib/queries/sales";
import {
	Calendar,
	User,
	Receipt,
	CreditCard,
	Percent,
	Tag,
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { SalesCellAction } from "./sales-cell-action";

export function getSalesTableColumns(): ColumnDef<SaleWithCustomer>[] {
	return [
		{
			id: "invoiceNumber",
			accessorKey: "invoiceNumber",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Invoice" />
			),
			cell: ({ row }) => {
				const hasDiscount =
					row.original.discountAmount &&
					parseFloat(row.original.discountAmount) > 0;
				return (
					<div className="flex items-center gap-2">
						<Receipt className="h-3 w-3 text-muted-foreground" />
						<span
							className={cn(
								"font-mono text-sm",
								hasDiscount && "font-semibold",
							)}
						>
							{row.original.invoiceNumber}
						</span>
						{hasDiscount && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<Badge variant="secondary" className="h-5 px-1">
											<Percent className="h-3 w-3" />
										</Badge>
									</TooltipTrigger>
									<TooltipContent>
										<p className="text-xs">
											Discount:{" "}
											{formatCurrency(parseFloat(row.original.discountAmount || ''))}(
											{row.original.discountType})
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
				);
			},
			enableSorting: true,
			meta: {
				label: "Invoice",
				variant: "text",
			},
		},
		{
			id: "customerName",
			accessorKey: "customerName",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Customer" />
			),
			cell: ({ row }) => {
				return (
					<div className="flex items-center gap-2">
						<User className="h-3 w-3 text-muted-foreground" />
						<span className="font-medium">
							{row.original.customerName || "N/A"}
						</span>
					</div>
				);
			},
			enableSorting: true,
			enableColumnFilter: true,
			meta: {
				label: "Customer",
				variant: "text",
				placeholder: "Search customer...",
			},
		},
		{
			id: "saleDate",
			accessorKey: "saleDate",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Sale Date" />
			),
			cell: ({ row }) => {
				return (
					<div className="flex items-center gap-2 text-sm">
						<Calendar className="h-3 w-3 text-muted-foreground" />
						<span>{formatDate(row.original.saleDate)}</span>
					</div>
				);
			},
			enableSorting: true,
			meta: {
				label: "Sale Date",
				variant: "date",
			},
		},
		{
			id: "totalAmount",
			accessorKey: "totalAmount",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Total Amount" />
			),
			cell: ({ row }) => {
				const amount = parseFloat(row.original.totalAmount);
				const hasDiscount =
					row.original.discountAmount &&
					parseFloat(row.original.discountAmount) > 0;
				return (
					<div
						className={cn(
							"font-medium",
							hasDiscount && "text-green-600 dark:text-green-400",
						)}
					>
						{formatCurrency(amount)}
					</div>
				);
			},
			enableSorting: true,
		},
		{
			id: "discountAmount",
			accessorKey: "discountAmount",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Discount" />
			),
			cell: ({ row }) => {
				const discount = row.original.discountAmount
					? parseFloat(row.original.discountAmount)
					: 0;
				if (discount === 0) {
					return <span className="text-muted-foreground">—</span>;
				}
				return (
					<div className="flex items-center gap-2">
						<Tag className="h-3 w-3 text-orange-500" />
						<span className="font-medium text-orange-600 dark:text-orange-400">
							{formatCurrency(discount)}
						</span>
					</div>
				);
			},
			enableSorting: true,
		},
		{
			id: "discountType",
			accessorKey: "discountType",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Discount Type" />
			),
			cell: ({ row }) => {
				if (!row.original.discountType) {
					return <span className="text-muted-foreground">—</span>;
				}
				const typeColors = {
					FLAT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
					PERCENT:
						"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
					WEIGHT_BASED:
						"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
				};
				return (
					<Badge
						variant="outline"
						className={
							typeColors[row.original.discountType as keyof typeof typeColors]
						}
					>
						{row.original.discountType.replace("_", " ")}
					</Badge>
				);
			},
			enableColumnFilter: true,
			meta: {
				label: "Discount Type",
				variant: "multiSelect",
				options: [
					{ label: "Flat", value: "FLAT" },
					{ label: "Percent", value: "PERCENT" },
					{ label: "Weight Based", value: "WEIGHT_BASED" },
				],
			},
		},
		{
			id: "amountPaid",
			accessorKey: "amountPaid",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Paid" />
			),
			cell: ({ row }) => {
				const paid = parseFloat(row.original.amountPaid);
				return (
					<div className="flex items-center gap-2">
						<CreditCard className="h-3 w-3 text-muted-foreground" />
						<span>{formatCurrency(paid)}</span>
					</div>
				);
			},
			enableSorting: true,
		},
		{
			id: "amountDue",
			accessorKey: "amountDue",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Due" />
			),
			cell: ({ row }) => {
				const due = parseFloat(row.original.amountDue);
				return (
					<div
						className={cn(
							"font-medium",
							due > 0
								? "text-red-600 dark:text-red-400"
								: "text-muted-foreground",
						)}
					>
						{due > 0 ? formatCurrency(due) : "—"}
					</div>
				);
			},
			enableSorting: true,
		},
		{
			id: "actions",
			cell: ({ row }) => <SalesCellAction data={row.original} />,
			enableHiding: false,
		},
	];
}
