import type { FlattenedCattle } from '@/features/cattle/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface SlaughterInfoProps {
  data: Pick<
    FlattenedCattle,
    | 'purchaseDate'
    | 'purchasePricePerKg'
    | 'liveWeight'
    | 'purchaseLocation'
    | 'fatPercentage'
  >;
}

export const SlaughterInfo: React.FC<SlaughterInfoProps> = ({ data }) => {
  const fatWeight = (data.liveWeight * data.fatPercentage) / 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Slaughter Info</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-2 text-sm'>
        <div className='flex justify-between'>
          <span className='font-medium'>Slaughter Date:</span>
          <span>{data.purchaseDate.toDateString()}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium'>Fat weight:</span>
          <span>{fatWeight} kg</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium'>Lean Meat Weight:</span>
          <span>{data.liveWeight - fatWeight} kg</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium'>Liver weight:</span>
          <span>{data.liveWeight - fatWeight + 5.3} kg</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium'>Brain weight:</span>
          <span>{1.3} kg</span>
        </div>
      </CardContent>
    </Card>
  );
};
