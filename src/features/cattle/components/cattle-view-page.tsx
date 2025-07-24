import prisma from '@/prisma';
import { notFound } from 'next/navigation';
import CattleForm from './cattle-form';
import type { FlattenedCattle } from '../actions';

type TProductViewPageProps = {
  cattleId: string;
};

export default async function CattleViewPage({
  cattleId
}: TProductViewPageProps) {
  let cattle: FlattenedCattle | null = null;
  let pageTitle = 'Add New Cattle';

  if (cattleId !== 'new') {
    const data = await prisma.cattle.findUnique({
      where: {
        id: cattleId
      },
      include: {
        cattlePurchase: true,
        cattleSale: true
      }
    });

    if (!data) {
      notFound();
    }

    cattle = {
      ...data,
      ...data.cattlePurchase,
      ...data.cattleSale
    };

    pageTitle = 'Edit Cattle';
  }

  return <CattleForm initialData={cattle} pageTitle={pageTitle} />;
}
