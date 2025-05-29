import { fakeProducts } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { CattleTable } from './cattle-tables';
import { columns } from './cattle-tables/columns/index';
import { Cattle, CattleClass } from '@/prisma/generated/prisma';
import { initializeCattleActions } from '../actions';

export default async function CattleListingPage() {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const sort = searchParamsCache.get('sort');
  const healthStatus = searchParamsCache.get('healthStatus');
  const purchasePricePerKg = searchParamsCache.get('purchasePricePerKg');
  const fatPercentage = searchParamsCache.get('fatPercentage');
  const cattleClass = searchParamsCache.get('cattleClass');
  const cattleNumber = searchParamsCache.get('cattleNumber');
  const purchaseDate = searchParamsCache.get('purchaseDate');
  const purchasePrice = searchParamsCache.get('purchasePrice');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(healthStatus && { healthStatus }),
    ...(purchasePricePerKg && { purchasePricePerKg }),
    ...(fatPercentage && { fatPercentage }),
    ...(cattleClass && { cattleClass }),
    ...(cattleNumber && { cattleNumber }),
    ...(purchaseDate && { purchaseDate }),
    ...(purchasePrice && { purchasePrice })
  };

  const cattleActions = await initializeCattleActions();

  const result = await cattleActions.getProducts(filters);

  return (
    <CattleTable
      data={result.cattle}
      totalItems={result.total_cattle}
      columns={columns}
    />
  );
}
