import { fakeProducts, Product } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import TransactionForm from './transaction-form';
import prisma from '@/prisma';
import { Transaction } from '@/prisma/generated/prisma';

type TProductViewPageProps = {
  transactionId: string;
};

export default async function TransactionViewPage({
  transactionId
}: TProductViewPageProps) {
  let transaction = null;
  let pageTitle = 'Add New Transaction';

  if (transactionId !== 'new') {
    const data = await prisma.transaction.findUnique({
      where: {
        id: transactionId
      }
    });
    transaction = data as Transaction;
    if (!transaction) {
      notFound();
    }
    pageTitle = `Edit Transaction`;
  }

  return <TransactionForm pageTitle={pageTitle} />;
}
