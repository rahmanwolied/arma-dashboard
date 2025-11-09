/**
 * TanStack Query Hook: Batch Purchase Creation
 * Handles the mutation for creating a batch cattle purchase with proper error handling and cache invalidation
 */

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createBatchPurchaseAction } from '../actions/create-batch-purchase'
import { completeBatchPurchaseSchema, type CompleteBatchPurchaseFormValues } from '../validations/batch-purchase-schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getTodayDate } from '../helpers/date'

interface UseCreateBatchPurchaseOptions {
    onSuccess?: (data: {
        totalCattle: number
        totalInvestment: number
        purchaseDate: string
        marketName: string
    }) => void
    onError?: (error: Error) => void
}

export function useCreateBatchPurchase(options?: UseCreateBatchPurchaseOptions) {
    const queryClient = useQueryClient()


    const form = useForm<CompleteBatchPurchaseFormValues>({
        resolver: zodResolver(completeBatchPurchaseSchema),
        defaultValues: {
            purchaseDate: getTodayDate(),
            marketValue: {
                name: "",
                location: "",
                phone: "",
                isNew: false,
            },
            numberOfCattle: "0",
            cattle: [],
            transportCost: "0",
            hasilFee: "0",
            miscCost: "0",
        },
    })

    const { mutateAsync, isPending, isError, isSuccess, error } = useMutation({
        mutationFn: async (data: CompleteBatchPurchaseFormValues) => {
            const result = await createBatchPurchaseAction(data)

            if (!result.success) {
                throw new Error(result.error || 'Failed to create batch purchase')
            }

            if (!result.data) {
                throw new Error('No data returned from batch purchase creation')
            }

            return result.data
        },

        onSuccess: (data) => {
            // Show success toast
            toast.success('Batch purchase created successfully!', {
                description: `${data.totalCattle} cattle added to inventory at ${data.marketName}`,
                duration: 5000,
            })

            // Invalidate relevant queries to refresh cattle data
            queryClient.invalidateQueries({ queryKey: ['cattle'] })
            queryClient.invalidateQueries({ queryKey: ['cattle-list'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })

            // Call custom onSuccess callback if provided
            options?.onSuccess?.(data)
        },

        onError: (error: Error) => {
            // Show error toast
            toast.error('Failed to create batch purchase', {
                description: error.message,
                duration: 7000,
            })

            // Log error for debugging
            console.error('Batch purchase creation error:', error)

            // Call custom onError callback if provided
            options?.onError?.(error)
        },
    })

    const handleSubmit = async (data: CompleteBatchPurchaseFormValues) => {
        return await mutateAsync(data)
    }

    return {
        form,
        handleSubmit,
        isPending,
        isError,
        isSuccess,
        error,
    }
}

