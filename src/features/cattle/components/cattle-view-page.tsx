import { fakeProducts, Product } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import CattleForm from './cattle-form';

type TProductViewPageProps = {
  cattleId: string;
};

export default async function CattleViewPage({
  cattleId
}: TProductViewPageProps) {
  let cattle = null;
  let pageTitle = 'Add New Cattle';

  if (cattleId !== 'new') {
    const data = await fakeProducts.getProductById(Number(cattleId));
    cattle = data.product as Product;
    if (!cattle) {
      notFound();
    }
    pageTitle = `Edit Cattle`;
  }

  return <CattleForm initialData={cattle} pageTitle={pageTitle} />;
}
