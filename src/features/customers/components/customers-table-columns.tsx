"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatDate } from "@/lib/format";
import type { ColumnDef } from "@tanstack/react-table";
import type { CustomerWithAddress } from "@/app/_lib/queries/customers";
import { Phone, Mail, MapPin, Calendar } from "lucide-react";
import { getAllDistricts, getAllDivisions } from "@/app/_lib/queries/divisions";
import { CustomerCellAction } from "./customer-cell-action";

type GetCustomerTableColumnsProps = {
	districts: Awaited<ReturnType<typeof getAllDistricts>>
	divisions	: Awaited<ReturnType<typeof getAllDivisions>>
}
/**
 * Helper function to extract unique values and create filter options
 */
function getUniqueOptions(
	data: GetCustomerTableColumnsProps["districts"] | GetCustomerTableColumnsProps["divisions"]
): Array<{ value: string; label: string }> {
	return data.map((item) => ({
		value: item.id,
		label: item.name,
	}));
}

export function getCustomersTableColumns(
	data: GetCustomerTableColumnsProps,
): ColumnDef<CustomerWithAddress>[] {
	const divisionOptions = getUniqueOptions(data.divisions);
	const districtOptions = getUniqueOptions(data.districts);

	return [
		{
			id: "name",
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Name" />
			),
			cell: ({ row }) => {
				return <div className="font-medium">{row.original.name}</div>;
			},
			enableSorting: true,
			enableHiding: false,
			meta: {
				label: "Name",
				placeholder: "Search by name...",
				variant: "text",
			},
		},
		{
			id: "primaryPhone",
			accessorKey: "primaryPhone",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Phone" />
			),
			cell: ({ row }) => {
				return (
					<div className="flex items-center gap-2">
						<Phone className="h-3 w-3 text-muted-foreground" />
						<span>{row.original.primaryPhone}</span>
					</div>
				);
			},
			enableSorting: false,
			meta: {
				label: "Phone",
				variant: "text",
			},
		},
		{
			id: "address",
			accessorFn: (row) => {
				const parts = [];
				if (row.addressLine) parts.push(row.addressLine);
				if (row.zoneName) parts.push(row.zoneName);
				if (row.districtName) parts.push(row.districtName);
				if (row.divisionName) parts.push(row.divisionName);
				return parts.join(", ") || "No address";
			},
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Address" />
			),
			cell: ({ row }) => {
				const parts = [];
				if (row.original.addressLine) parts.push(row.original.addressLine);
				if (row.original.zoneName) parts.push(row.original.zoneName);
				if (row.original.districtName) parts.push(row.original.districtName);
				if (row.original.divisionName) parts.push(row.original.divisionName);
				const address = parts.join(", ") || "No address";

				return (
					<div className="flex items-start gap-2 max-w-[300px]">
						<MapPin className="h-3 w-3 text-muted-foreground mt-1 shrink-0" />
						<span className="text-sm truncate">{address}</span>
					</div>
				);
			},
			enableSorting: false,
			meta: {
				label: "Address",
				variant: "text",
			},
		},
		{
			id: "division",
			accessorKey: "divisionName",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Division" />
			),
			cell: ({ row }) => {
				return <div>{row.original.divisionName || "—"}</div>;
			},
			enableColumnFilter: true,
			meta: {
				label: "Division",
				variant: "multiSelect",
				options: divisionOptions,
			},
		},
		{
			id: "district",
			accessorKey: "districtName",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="District" />
			),
			cell: ({ row }) => {
				return <div>{row.original.districtName || "—"}</div>;
			},
			enableColumnFilter: true,
			meta: {
				label: "District",
				variant: "multiSelect",
				options: districtOptions,
			},
		},
		{
			id: "email",
			accessorKey: "email",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Email" />
			),
			cell: ({ row }) => {
				if (!row.original.email)
					return <span className="text-muted-foreground">—</span>;
				return (
					<div className="flex items-center gap-2">
						<Mail className="h-3 w-3 text-muted-foreground" />
						<span className="text-sm">{row.original.email}</span>
					</div>
				);
			},
			enableSorting: false,
		},
		{
			id: "createdAt",
			accessorKey: "createdAt",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Created" />
			),
			cell: ({ row }) => {
				return (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Calendar className="h-3 w-3" />
						<span>{formatDate(row.original.createdAt)}</span>
					</div>
				);
			},
			enableSorting: true,
		},
		{
			id: "actions",
			cell: ({ row }) => <CustomerCellAction data={row.original} />,
			enableHiding: false,
		},
	];
}
