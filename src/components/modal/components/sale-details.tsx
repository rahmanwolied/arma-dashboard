import type { FlattenedCattle } from '@/features/cattle/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SaleDetailsProps {
  data: Partial<
    Pick<FlattenedCattle, 'saleDate' | 'salePricePerKg' | 'fatPercentage'>
  >;
}

export const SaleDetails: React.FC<SaleDetailsProps> = ({ data }) => {
  if (!data.saleDate) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sale Details</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-2 text-sm'>
        <div className='flex justify-between'>
          <span className='font-medium'>Sale Date:</span>
          <span>{data.saleDate?.toLocaleDateString() || 'N/A'}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium'>Sale Price/Kg:</span>
          <span>৳ {data.salePricePerKg?.toFixed(2) || 'N/A'}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium'>Weight at Sale:</span>
          <span>{'N/A'} kg</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium'>Meat Percentage:</span>
          <span>{'N/A'}%</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium'>Fat Percentage:</span>
          <span>{data.fatPercentage || 'N/A'}%</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium'>Customer Name:</span>
          <span>{'N/A'}</span>
        </div>
      </CardContent>
    </Card>
  );
};
