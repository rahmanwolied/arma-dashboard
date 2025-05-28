import { fakeProducts, Product } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import CowForm from './cow-form';

type TProductViewPageProps = {
  cowId: string;
};

export default async function CowViewPage({ cowId }: TProductViewPageProps) {
  let cow = null;
  let pageTitle = 'Add New Cow';

  if (cowId !== 'new') {
    const data = await fakeProducts.getProductById(Number(cowId));
    cow = data.product as Product;
    if (!cow) {
      notFound();
    }
    pageTitle = `Edit Cow`;
  }

  return <CowForm initialData={cow} pageTitle={pageTitle} />;
}
