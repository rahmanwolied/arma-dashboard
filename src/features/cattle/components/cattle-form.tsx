'use client';

import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Cattle } from '@/prisma/generated/prisma';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { createCattle } from '../actions';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const MB = 1024 * 1024;
const MAX_FILE_SIZE = 3 * MB;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const formSchema = z.object({
  image: z
    .any()
    // .refine((files) => files?.length == 1, 'Image is required.')
    // .refine(
    //   (files) => files?.[0]?.size <= MAX_FILE_SIZE,
    //   `Max file size is 3MB.`
    // )
    // .refine(
    //   (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    //   '.jpg, .jpeg, .png and .webp files are accepted.'
    // )
    .optional(),
  name: z.string().optional(),

  liveWeight: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, 'Live weight must be a positive number.'),
  purchasePricePerKg: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, 'Purchase price per kg must be a positive number.'),
  cattleClass: z.string(),
  gender: z.string(),
  fatPercentage: z.string().optional(),
  meatPercentage: z.string().optional(),

  isVaccinated: z.boolean().optional(),
  isPregnant: z.boolean().optional(),
  isLactating: z.boolean().optional(),
  isQuarantined: z.boolean().optional(),
  isSold: z.boolean().optional()
});

export default function CowForm({
  initialData,
  pageTitle
}: {
  initialData: Cattle | null;
  pageTitle: string;
}) {
  const defaultValues = {
    name: initialData?.name || '',
    image: initialData?.imageUrl || [],
    liveWeight: initialData?.liveWeight?.toString() || '',
    purchasePricePerKg: initialData?.purchasePricePerKg?.toString() || '',
    cattleClass: initialData?.cattleClass || '',
    isVaccinated: initialData?.isVaccinated || false,
    isPregnant: initialData?.isPregnant || false,
    isLactating: initialData?.isLactating || false,
    isQuarantined: initialData?.isQuarantined || false,
    isSold: initialData?.isSold || false,
    gender: initialData?.gender || '',
    fatPercentage: initialData?.fatPercentage?.toString() || '',
    meatPercentage: initialData?.meatPercentage?.toString() || ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  const isSubmitting = form.formState.isSubmitting;
  const disabled = isSubmitting || !!initialData;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await createCattle(values);
    if (result) {
      toast.success('Cattle added successfully', {
        description: `Cattle Number: ${result.cattleNumber}`
      });
      form.reset();
    } else {
      toast.error('Failed to add cattle', {
        description: 'Failed to add cattle',
        action: {
          label: 'Retry',
          onClick: () => {
            onSubmit(values);
          }
        }
      });
    }
  }

  return (
    <Card className='mx-auto w-1/2'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <div className='space-y-6'>
                  <FormItem className='w-full'>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        disabled={true}
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={4}
                        maxSize={4 * 1024 * 1024}
                        // disabled={loading}
                        // progresses={progresses}
                        // pass the onUpload function here for direct upload
                        // onUpload={uploadFiles}
                        // disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cattle Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter cattle name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='liveWeight'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live Weight (KG)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='Enter live weight'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='purchasePricePerKg'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price (per KG)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='Enter purchase price'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='fatPercentage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fat Percentage</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='Enter fat percentage'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='meatPercentage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meat Percentage</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='Enter meat percentage'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='cattleClass'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cattle Class</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select cattle class' />
                      </SelectTrigger>
                      <FormControl>
                        <SelectContent>
                          <SelectItem value='GOLD'>GOLD</SelectItem>
                          <SelectItem value='SILVER'>SILVER</SelectItem>
                          <SelectItem value='PLATINUM'>PLATINUM</SelectItem>
                        </SelectContent>
                      </FormControl>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select gender' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='MALE'>MALE</SelectItem>
                          <SelectItem value='FEMALE'>FEMALE</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='isVaccinated'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div
                        className={`flex cursor-pointer items-center gap-4 rounded-md border p-2 transition-colors ${
                          field.value
                            ? 'border-green-300 bg-green-100 dark:border-green-500 dark:bg-green-900'
                            : 'dark:bg-muted border-gray-200 bg-gray-50 dark:border-gray-500'
                        }`}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Icons.isVaccinated
                          className={`h-6 w-6 ${
                            field.value
                              ? 'text-green-500 dark:text-green-500'
                              : 'text-gray-500 dark:text-gray-500'
                          }`}
                        />
                        <h1 className='text-sm font-medium'>Vaccinated</h1>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch('gender') === 'FEMALE' && (
                <>
                  <FormField
                    control={form.control}
                    name='isPregnant'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div
                            className={`flex cursor-pointer items-center gap-4 rounded-md border p-2 transition-colors ${
                              field.value
                                ? 'border-green-300 bg-green-100 dark:border-green-500 dark:bg-green-900'
                                : 'dark:bg-muted border-gray-200 bg-gray-50 dark:border-gray-500'
                            }`}
                            onClick={() => field.onChange(!field.value)}
                          >
                            <Icons.isPregnant
                              className={`h-6 w-6 ${
                                field.value
                                  ? 'text-green-500 dark:text-green-500'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}
                            />
                            <h1 className='text-sm font-medium'>Pregnant</h1>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='isLactating'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div
                            className={`flex cursor-pointer items-center gap-4 rounded-md border p-2 transition-colors ${
                              field.value
                                ? 'border-green-300 bg-green-100 dark:border-green-500 dark:bg-green-900'
                                : 'dark:bg-muted border-gray-200 bg-gray-50 dark:border-gray-500'
                            }`}
                            onClick={() => field.onChange(!field.value)}
                          >
                            <Icons.isLactating
                              className={`h-6 w-6 ${
                                field.value
                                  ? 'text-green-500 dark:text-green-500'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}
                            />
                            <h1 className='text-sm font-medium'>Lactating</h1>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name='isQuarantined'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div
                        className={`flex cursor-pointer items-center gap-4 rounded-md border p-2 transition-colors ${
                          field.value
                            ? 'border-green-300 bg-green-100 dark:border-green-500 dark:bg-green-900'
                            : 'dark:bg-muted border-gray-200 bg-gray-50 dark:border-gray-500'
                        }`}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Icons.isQuarantined
                          className={`h-6 w-6 ${
                            field.value
                              ? 'text-green-500 dark:text-green-500'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        />
                        <h1 className='text-sm font-medium'>Quarantined</h1>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='isSold'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div
                        className={`flex cursor-pointer items-center gap-4 rounded-md border p-2 transition-colors ${
                          field.value
                            ? 'border-green-300 bg-green-100 dark:border-green-500 dark:bg-green-900'
                            : 'dark:bg-muted border-gray-200 bg-gray-50 dark:border-gray-500'
                        }`}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Icons.isSold
                          className={`h-6 w-6 ${
                            field.value
                              ? 'text-green-500 dark:text-green-500'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        />
                        <h1 className='text-sm font-medium'>Sold</h1>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <div className='flex w-full items-center justify-between'>
              <h1 className='text-sm font-medium'>
                Total Cost:{' '}
                {(
                  Number(form.watch('purchasePricePerKg')) *
                  Number(form.watch('liveWeight'))
                ).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'BDT',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  currencyDisplay: 'narrowSymbol'
                })}
              </h1>
              <Button type='submit' disabled={disabled}>
                {isSubmitting ? (
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Icons.cattle className='mr-2 h-4 w-4' />
                )}
                {isSubmitting ? 'Saving...' : 'Add Cattle'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
