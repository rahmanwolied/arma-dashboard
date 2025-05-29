import { searchParamsCache } from '@/lib/searchparams';
import { columns, TransactionWithCustomer } from './transaction-tables/columns';
import { Transaction } from '@/prisma/generated/prisma';
import { TransactionTable } from './transaction-tables';
import { initializeTransactionActions } from '../actions';

type TransactionListingPage = {
  transactions: TransactionWithCustomer[];
};

export default async function TransactionListingPage() {
  // Showcasing the use of search params cache in nested RSCs
  const search = searchParamsCache.get('name');
  const status = searchParamsCache.get('status');
  const page = searchParamsCache.get('page');
  const pageLimit = searchParamsCache.get('perPage');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(status && { status })
  };

  const transactionActions = await initializeTransactionActions();

  const result = await transactionActions.getTransactions(filters);
  console.log(result);
  return (
    <TransactionTable
      data={result.transactions}
      totalItems={result.total_transactions}
      columns={columns}
    />
  );
}
