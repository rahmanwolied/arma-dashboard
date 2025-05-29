import { PaymentStatus } from '@/prisma/generated/prisma';
import { PaymentMethod } from '@/prisma/generated/prisma';
import { z } from 'zod';

export const transactionSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Customer name is required'),
    phone: z.string().min(1, 'Customer phone is required'),
    id: z.string().optional(),
    address: z.string().optional(),
    isNew: z.boolean().optional()
  }),
  remarks: z.string().optional(),
  cattleNumber: z.string(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  paidAmount: z.coerce.number().optional(),
  salePriceKg: z.coerce.number()
});

export type TTransactionSchema = z.infer<typeof transactionSchema>;
