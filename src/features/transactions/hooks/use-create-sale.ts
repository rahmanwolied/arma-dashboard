import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { saleSchema } from "../validations/sale-schema";
import { createSaleAction } from "../actions/create-sale";
import type { SaleFormData, UseCreateSaleOptions } from "../types";

/**
 * Custom hook for creating sales with form management
 *
 * Encapsulates:
 * - Form state management (react-hook-form)
 * - Mutation logic (TanStack Query)
 * - Success/error handling
 * - Cache invalidation
 *
 * @param options - Optional configuration for callbacks
 * @returns Form methods and mutation state
 */
export function useCreateSale(options?: UseCreateSaleOptions) {
	const queryClient = useQueryClient();

	// Form setup with Zod validation
	const form = useForm<SaleFormData>({
		resolver: zodResolver(saleSchema),
		defaultValues: {
			customer: {
				name: "",
				phone: "",
				email: "",
			},
			animals: [],
			pricePerKg: 0,
			saleDate: new Date(),
			payments: [],
			paymentTerms: "",
			remarks: "",
		},
	});

	// Mutation for creating sale
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: SaleFormData) => {
			const result = await createSaleAction(data);

			if (!result.success) {
				throw new Error(result.message);
			}

			return result.data;
		},
		onSuccess: (data) => {
			// Success feedback
			toast.success("Sale created successfully!");

			// Invalidate queries
			queryClient.invalidateQueries({ queryKey: ["sales"] });
			queryClient.invalidateQueries({ queryKey: ["available-cattle"] });

			// Reset form
			form.reset();

			// Call custom success callback
			options?.onSuccess?.(data);
		},
		onError: (error) => {
			// Error feedback
			toast.error(error instanceof Error ? error.message : "Failed to create sale");

			// Call custom error callback
			options?.onError?.(error instanceof Error ? error : new Error(String(error)));
		},
	});

	return {
		form,
		handleSubmit: mutateAsync,
		isPending,
	};
}
