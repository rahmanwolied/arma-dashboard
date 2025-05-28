'use server';

import prisma from '@/prisma';
import { formSchema } from './customer-form';
import { z } from 'zod';

export async function createCustomer(formData: z.infer<typeof formSchema>) {
  const { name, address, phone } = formData;

  await prisma.customer.create({
    data: {
      name,
      address,
      phone
    }
  });
}
