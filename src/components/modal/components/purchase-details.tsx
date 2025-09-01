import type { FlattenedCattle } from '@/features/cattle/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface PurchaseDetailsProps {
  data: Pick<
    FlattenedCattle,
    'purchaseDate' | 'purchasePricePerKg' | 'liveWeight' | 'purchaseLocation'
  >;
}

export const PurchaseDetails: React.FC<PurchaseDetailsProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Details</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-2 text-sm'>
        <div className='flex justify-between'>
          <span className='font-medium'>Purchase Date:</span>
          <span>{data.purchaseDate.toDateString()}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium'>Purchase Price/Kg:</span>
          <span>{formatCurrency(data.purchasePricePerKg)}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium'>Weight at Purchase:</span>
          <span>{data.liveWeight} kg</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium'>Actual Price:</span>
          <span>
            {formatCurrency(data.liveWeight * data.purchasePricePerKg)}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium'>Purchase Location:</span>
          <span>{data.purchaseLocation}</span>
        </div>
      </CardContent>
    </Card>
  );
};
