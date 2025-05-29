import { searchParamsCache } from '@/lib/searchparams';
import { columns } from './customer-tables/columns';
import { CattleClass, Customer } from '@/prisma/generated/prisma';
import { CustomerTable } from './customer-tables';
import { initializeCustomerActions } from '../actions';

type CustomerListingPage = {
  customers: Customer[];
};

export default async function CustomerListingPage({
  customers
}: CustomerListingPage) {
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

  const customerActions = await initializeCustomerActions();

  const result = await customerActions.getCustomers(filters);

  return (
    <CustomerTable
      data={result.customers}
      totalItems={result.total_customers}
      columns={columns}
    />
  );
}
