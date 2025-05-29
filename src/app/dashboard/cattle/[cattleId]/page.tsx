import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import CattleViewPage from '@/features/cattle/components/cattle-view-page';

export const metadata = {
  title: 'Dashboard : Cattle View'
};

type PageProps = { params: Promise<{ cattleId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <CattleViewPage cattleId={params.cattleId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
