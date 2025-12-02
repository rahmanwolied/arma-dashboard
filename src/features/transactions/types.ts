/**
 * Transactions Feature Type Definitions
 *
 * This file contains all TypeScript type definitions used across the transactions feature.
 * Re-exports schema types and defines additional feature-specific types.
 */

import type { saleSchema } from "./validations/sale-schema";
import type { z } from "zod";

// Re-export schema types
export type SaleFormData = z.infer<typeof saleSchema>;

// Discount calculation types
export type DiscountType = "FLAT" | "PERCENT" | "WEIGHT_BASED";

export interface DiscountCalculationResult {
	discountAmount: number;
	actualDiscountedWeight?: number;
}

// Payment types
export type PaymentMethod =
	| "CASH"
	| "CREDIT_CARD"
	| "BANK_TRANSFER"
	| "MOBILE_MONEY";

export interface PaymentEntry {
	paymentMethod: PaymentMethod;
	paidAmount: number;
}

// Sale preview/summary types
export interface SalePreview {
	totalWeight: number;
	totalAmount: number;
	totalCost: number;
	discountAmount: number;
	finalAmount: number;
	profitLoss: number;
	profitMargin: number;
	dueAmount: number;
	hasDue: boolean;
}

// Animal in sale types
export interface SaleAnimal {
	id: string;
	tagNumber: string;
	liveWeight: number;
	adjustedPrice?: number;
}

// Customer types
export interface SaleCustomer {
	id?: string;
	name: string;
	phone: string;
	email?: string;
	address?: {
		addressLine: string;
		divisionId?: string;
		districtId?: string;
		zoneId?: string;
		divisionName?: string;
		districtName?: string;
		zoneName?: string;
	};
	isNew?: boolean;
}

// Service layer types
export interface CreateSaleInput {
	data: SaleFormData;
	userId: string;
}

export interface SaleServiceResult {
	sale: {
		id: string;
		invoiceNumber: string;
		totalAmount: string;
		discountAmount: string | null;
		amountPaid: string;
		amountDue: string;
		saleDate: Date;
	};
	totalWeight: number;
	actualDiscountedWeight?: number;
	discountAmount: number;
}

// Action result types
export interface ActionSuccess<T = unknown> {
	success: true;
	message: string;
	data: T;
}

export interface ActionError {
	success: false;
	message: string;
	error?: unknown;
}

export type ActionResult<T = unknown> = ActionSuccess<T> | ActionError;

// Sale detail view type (includes stored amounts from database)
export interface SaleDetailData extends SaleFormData {
	// Stored amounts from database (for display purposes)
	storedAmounts?: {
		totalAmount: number;
		discountAmount: number;
		amountPaid: number;
		amountDue: number;
		invoiceNumber: string;
	};
}

// Query hooks options
export interface UseCreateSaleOptions {
	onSuccess?: (data: SaleServiceResult) => void;
	onError?: (error: Error) => void;
}

export interface UseSaleQueryOptions {
	saleId: string;
	enabled?: boolean;
}
