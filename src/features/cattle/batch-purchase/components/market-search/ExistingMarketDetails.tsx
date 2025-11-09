/**
 * Display component for existing market details
 */

"use client";

import { MapPin, Phone, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MarketValue } from "./types";

interface ExistingMarketDetailsProps {
	market: MarketValue;
}

export function ExistingMarketDetails({ market }: ExistingMarketDetailsProps) {
	return (
		<div className="space-y-3 rounded-md border border-border bg-muted/30 p-4">
			<div className="flex items-center gap-2">
				<Badge variant="secondary" className="flex items-center gap-1">
					<Store className="h-3 w-3" />
					Existing Market
				</Badge>
			</div>

			<div className="grid gap-3">
				{/* Location */}
				{market.location && (
					<div className="space-y-1.5">
						<Label className="text-xs text-muted-foreground flex items-center gap-1">
							<MapPin className="h-3 w-3" />
							Location
						</Label>
						<Input
							value={market.location}
							disabled
							className="bg-background/50"
						/>
					</div>
				)}

				{/* Phone Number */}
				{market.phone && (
					<div className="space-y-1.5">
						<Label className="text-xs text-muted-foreground flex items-center gap-1">
							<Phone className="h-3 w-3" />
							Contact Number
						</Label>
						<Input value={market.phone} disabled className="bg-background/50" />
					</div>
				)}
			</div>
		</div>
	);
}
