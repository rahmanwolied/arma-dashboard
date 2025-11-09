"use client";

import { User, Phone, MapPin, Home, Map as MapIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CustomerValue } from "./types";

// ============================================================================
// Existing Customer Details Component
// ============================================================================

interface ExistingCustomerDetailsProps {
	customer: CustomerValue;
}

export function ExistingCustomerDetails({
	customer,
}: ExistingCustomerDetailsProps) {
	return (
		<div className="space-y-3 rounded-md border border-border bg-muted/30 p-4">
			<div className="flex items-center gap-2">
				<Badge variant="secondary" className="flex items-center gap-1">
					<User className="h-3 w-3" />
					Existing Customer
				</Badge>
			</div>

			<div className="grid gap-3">
				{/* Phone Number */}
				<div className="space-y-1.5">
					<Label className="text-xs text-muted-foreground">
						<Phone className="h-3 w-3" />
						Phone Number
					</Label>
					<Input value={customer.phone} disabled className="bg-background/50" />
				</div>

				{/* Division */}
				{customer.address?.divisionName && (
					<div className="space-y-1.5">
						<Label className="text-xs text-muted-foreground">
							<MapIcon className="h-3 w-3" />
							Division
						</Label>
						<Input
							value={customer.address.divisionName}
							disabled
							className="bg-background/50"
						/>
					</div>
				)}

				{/* District */}
				{customer.address?.districtName && (
					<div className="space-y-1.5">
						<Label className="text-xs text-muted-foreground">
							<MapPin className="h-3 w-3" />
							District
						</Label>
						<Input
							value={customer.address.districtName}
							disabled
							className="bg-background/50"
						/>
					</div>
				)}

				{/* Zone */}
				{customer.address?.zoneName && (
					<div className="space-y-1.5">
						<Label className="text-xs text-muted-foreground">
							<MapPin className="h-3 w-3" />
							Zone/Upazila
						</Label>
						<Input
							value={customer.address.zoneName}
							disabled
							className="bg-background/50"
						/>
					</div>
				)}

				{/* Address Line */}
				{customer.address?.addressLine && (
					<div className="space-y-1.5">
						<Label className="text-xs text-muted-foreground">
							<Home className="h-3 w-3" />
							Address
						</Label>
						<Input
							value={customer.address.addressLine}
							disabled
							className="bg-background/50"
						/>
					</div>
				)}
			</div>
		</div>
	);
}

