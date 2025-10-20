"use client";

import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CustomerWithAddress } from "@/app/_lib/queries/customers";
import { IconEdit, IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteCustomer } from "../actions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

interface CustomerCellActionProps {
	data: CustomerWithAddress;
}

export function useDeleteCustomer() {
	return useMutation({
		mutationFn: async (id: string) => {
			return await deleteCustomer(id);
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


export const CustomerCellAction: React.FC<CustomerCellActionProps> = ({
	data,
}) => {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const { mutateAsync: deleteCustomerMutation, isPending } = useDeleteCustomer();

	const onConfirm = async () => {
		try {
			const result = await deleteCustomerMutation(data.id);
			if (!result.success) {
				throw new Error(result.message);
			}

			toast.success(result.message);
			setOpen(false);
		} catch (error) {
			toast.error((error as Error).message);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onConfirm}
				loading={isPending}
			/>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<IconDotsVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>

					<DropdownMenuItem
						onClick={() => router.push(`/dashboard/customers/${data.id}`)}
					>
						<IconEdit className="mr-2 h-4 w-4" /> Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpen(true)}>
						<IconTrash className="mr-2 h-4 w-4" /> Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};

