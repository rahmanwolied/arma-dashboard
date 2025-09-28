"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { CattleInfoModal } from "@/components/modal/cattle-info-modal";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconEye, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import type { CattleWithDetails } from "@/app/_lib/queries/cattle";
import { deleteCattle } from "@/features/cattle/actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface CellActionProps {
	data: CattleWithDetails;
}

export function useDeleteCattle() {
	return useMutation({
		mutationFn: async (id: string) => {
			return await deleteCattle(id);
		},
		onSuccess: () => {
			// Cache is automatically revalidated by the server action using revalidateTag
			// No need for manual cache invalidation since we use Next.js caching, not TanStack Query caching
		},
		onError: (error) => {
			toast.error((error as Error).message);
		},
	});
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const [alertOpen, setAlertOpen] = useState(false);
	const [cattleDetailsViewOpen, setCattleDetailsViewOpen] = useState(false);
	const { mutateAsync: deleteCattleMutation, isPending } = useDeleteCattle();

	const onConfirm = async () => {
		try {
			const result = await deleteCattleMutation(data.cattle.animalId);
			if (!result.success) {
				throw new Error(result.message);
			}

			toast.success(result.message);
			setAlertOpen(false);
			setCattleDetailsViewOpen(false);
		} catch (error) {
			toast.error((error as Error).message);
		}
	};

	return (
		<>
			<DeleteModal
				isOpen={alertOpen}
				setOpen={setAlertOpen}
				onConfirm={onConfirm}
				isPending={isPending}
			/>
			<CattleInfoModal
				isOpen={cattleDetailsViewOpen}
				onClose={() => setCattleDetailsViewOpen(false)}
				data={data}
			/>
			<div className="flex gap-2">
				<ViewButton setOpen={setCattleDetailsViewOpen} />
				<DeleteButton setOpen={setAlertOpen} />
			</div>
		</>
	);
};

function DeleteModal({
	isOpen,
	setOpen,
	onConfirm,
	isPending,
}: {
	isOpen: boolean;
	setOpen: (open: boolean) => void;
	onConfirm: () => void;
	isPending: boolean;
}) {
	return (
		<AlertModal
			isOpen={isOpen}
			onClose={() => setOpen(false)}
			onConfirm={onConfirm}
			loading={isPending}
			title="Are you sure you want to delete this cattle?"
			description="This action cannot be undone. This will permanently delete this cattle."
			confirmText="Delete"
			cancelText="Cancel"
		/>
	);
}

function ViewButton({ setOpen }: { setOpen: (open: boolean) => void }) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="ghost" onClick={() => setOpen(true)}>
					<IconEye />
				</Button>
			</TooltipTrigger>
			<TooltipContent>View</TooltipContent>
		</Tooltip>
	);
}

function DeleteButton({ setOpen }: { setOpen: (open: boolean) => void }) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="ghost" onClick={() => setOpen(true)}>
					<IconTrash />
				</Button>
			</TooltipTrigger>
			<TooltipContent
				arrowClassName="fill-destructive bg-destructive"
				className="bg-destructive text-white"
			>
				Delete
			</TooltipContent>
		</Tooltip>
	);
}
