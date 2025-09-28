"use client";
import { useEffect, useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { GeneralInfo } from "./components/general-info";
import { HealthStatus } from "./components/health-status";
import { PurchaseDetails } from "./components/purchase-details";
import { SaleDetails } from "./components/sale-details";
import { SlaughterInfo } from "./components/slaughter-info";
import type { CattleWithDetails } from "@/app/_lib/queries/cattle";

interface CattleModalProps {
	isOpen: boolean;
	onClose: () => void;
	data: CattleWithDetails;
}

export const CattleInfoModal: React.FC<CattleModalProps> = ({
	isOpen,
	onClose,
	data,
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<Sheet open={isOpen} onOpenChange={onClose}>
			<VisuallyHidden asChild>
				<SheetTitle>Cattle Info</SheetTitle>
			</VisuallyHidden>
			<SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
				<SheetHeader>
					<SheetTitle>Cattle Details: {data.cattle.tagNumber}</SheetTitle>
					<SheetDescription>
						Comprehensive information about this cattle.
					</SheetDescription>
				</SheetHeader>
				<div className="grid gap-6 px-6 py-6">
					<GeneralInfo data={data} />
					<HealthStatus data={data} />
					<PurchaseDetails data={data} />
					<SlaughterInfo data={data} />
					{data.sales.length > 0 && <SaleDetails data={data} />}
				</div>
			</SheetContent>
		</Sheet>
	);
};
