'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createTransaction } from '../../actions';
import { transactionSchema, TTransactionSchema } from '../transaction-schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import CustomerSearchField from './customer-search-bar';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function TransactionForm({ pageTitle }: { pageTitle: string }) {
  const defaultValues = {
    customer: {
      name: '',
      phone: '',
      address: '',
      id: ''
    },
    remarks: '',
    cattleNumber: '',
    salePriceKg: 0,
    paymentStatus: undefined,
    paymentMethod: undefined,
    paidAmount: undefined
  };

  const form = useForm<TTransactionSchema>({
    resolver: zodResolver(transactionSchema),
    values: defaultValues
  });

  // Watch for customer changes to auto-populate address and phone
  const customerValue = form.watch('customer');

  useEffect(() => {
    if (customerValue && customerValue.id && !customerValue.isNew) {
      // If it's an existing customer, update the address and phone fields
      if (customerValue.address !== undefined) {
        form.setValue('customer.address', customerValue.address);
      }
      if (customerValue.phone !== undefined) {
        form.setValue('customer.phone', customerValue.phone);
      }
    }
  }, [customerValue, form]);

  async function onSubmit(values: TTransactionSchema) {
    const result = await createTransaction(values);
    if (result.success) {
      toast.success(result.message);
      form.reset();
    } else {
      toast.error(result.message || 'Failed to create transaction');
    }
  }
  const isSubmitting = form.formState.isSubmitting;

  // Check if the selected customer is an existing customer
  const isExistingCustomer = Boolean(
    customerValue?.id && !customerValue?.isNew
  );

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='customer'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <CustomerSearchField
                        value={field.value}
                        onChange={field.onChange}
                        placeholder='Search customer'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='customer.address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter address'
                        {...field}
                        value={form.watch('customer.address')}
                        onChange={field.onChange}
                        disabled={isExistingCustomer}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='customer.phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter phone'
                        {...field}
                        value={form.watch('customer.phone')}
                        onChange={field.onChange}
                        disabled={isExistingCustomer}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='cattleNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cattle Number</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter cattle number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='remarks'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter remarks' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='salePriceKg'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Price (Kg)</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter sale price' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='paymentMethod'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select payment method' />
                      </SelectTrigger>
                      <FormControl>
                        <SelectContent>
                          <SelectItem value='CASH'>Cash</SelectItem>
                          <SelectItem value='BANK_TRANSFER'>
                            Bank Transfer
                          </SelectItem>
                          <SelectItem value='MOBILE_MONEY'>
                            Mobile Payment
                          </SelectItem>
                        </SelectContent>
                      </FormControl>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='paidAmount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid Amount</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter paid amount' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                  Adding...
                </>
              ) : (
                'Add Transaction'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
