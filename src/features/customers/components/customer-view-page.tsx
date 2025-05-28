import { fakeProducts, Product } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import CustomerForm from './customer-form';
import prisma from '@/prisma';
import { Customer } from '@/prisma/generated/prisma';

type TProductViewPageProps = {
  customerId: string;
};

export default async function CustomerViewPage({
  customerId
}: TProductViewPageProps) {
  let customer = null;
  let pageTitle = 'Add New Customer';

  if (customerId !== 'new') {
    const data = await prisma.customer.findUnique({
      where: {
        id: customerId
      }
    });
    customer = data as Customer;
    if (!customer) {
      notFound();
    }
    pageTitle = `Edit Customer`;
  }

  return <CustomerForm initialData={customer} pageTitle={pageTitle} />;
}
