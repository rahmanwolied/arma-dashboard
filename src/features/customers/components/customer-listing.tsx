import { searchParamsCache } from '@/lib/searchparams';
import { columns } from './customer-tables/columns';
import { Customer } from '@/prisma/generated/prisma';
import { CustomerTable } from './customer-tables';

type CustomerListingPage = {
  customers: Customer[];
};

export default async function CustomerListingPage({
  customers
}: CustomerListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const search = searchParamsCache.get('name');
  const status = searchParamsCache.get('status');

  const filteredCustomers = customers.filter((customer) => {
    const nameMatch =
      !search || customer.name.toLowerCase().includes(search.toLowerCase());
    const statusMatch =
      !status ||
      (status === 'old'
        ? customer.name.length % 2 === 0
        : customer.name.length % 2 !== 0) ||
      status === 'old,new' ||
      status === 'new,old';

    return nameMatch && statusMatch;
  });

  return (
    <CustomerTable
      data={filteredCustomers}
      totalItems={filteredCustomers.length}
      columns={columns}
    />
  );
}
