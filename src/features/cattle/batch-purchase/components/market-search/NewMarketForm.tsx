/**
 * Form component for creating a new market
 */

"use client";

import { MapPin, Phone, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MarketValue } from "./types";

interface NewMarketFormProps {
	market: MarketValue;
	onChange: (value: MarketValue) => void;
}

export function NewMarketForm({ market, onChange }: NewMarketFormProps) {
	const updateField = (field: keyof MarketValue, value: string | null) => {
		onChange({
			...market,
			[field]: value || null,
		});
	};

	return (
		<div className="space-y-3 rounded-md border border-dashed border-primary/50 bg-primary/5 p-4">
			<div className="flex items-center gap-2">
				<Badge variant="outline" className="flex items-center gap-1">
					<Plus className="h-3 w-3" />
					New Market
				</Badge>
			</div>

			<div className="grid gap-3">
				{/* Location */}
				<div className="space-y-1.5">
					<Label htmlFor="location" className="text-xs flex items-center gap-1">
						<MapPin className="h-3 w-3" />
						Location (Optional)
					</Label>
					<Input
						id="location"
						type="text"
						placeholder="Enter market location"
						value={market.location || ""}
						onChange={(e) => updateField("location", e.target.value)}
					/>
				</div>

				{/* Phone Number */}
				<div className="space-y-1.5">
					<Label htmlFor="phone" className="text-xs flex items-center gap-1">
						<Phone className="h-3 w-3" />
						Contact Number (Optional)
					</Label>
					<Input
						id="phone"
						type="tel"
						placeholder="Enter contact number"
						value={market.phone || ""}
						onChange={(e) => updateField("phone", e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
}
