import type { FlattenedCattle } from '@/features/cattle/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface GeneralInfoProps {
  data: Pick<
    FlattenedCattle,
    | 'imageUrl'
    | 'name'
    | 'cattleNumber'
    | 'id'
    | 'gender'
    | 'cattleClass'
    | 'createdAt'
    | 'updatedAt'
  >;
}

export const GeneralInfo: React.FC<GeneralInfoProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-4 md:grid-cols-2'>
        <div className='bg-muted flex flex-col items-center justify-center rounded-md p-4'>
          <Image
            src={data.imageUrl || '/assets/cow.png'}
            alt={`Image of ${data.name}`}
            width={150}
            height={150}
            className='mb-2 aspect-square rounded-full object-cover'
          />
          <p className='text-lg font-semibold'>{data.name}</p>
          {!data.name ? (
            <p className='text-lg font-semibold'>#{data.cattleNumber}</p>
          ) : (
            <p className='text-muted-foreground text-sm'>{data.cattleNumber}</p>
          )}
        </div>
        <div className='grid gap-2 text-sm'>
          <div className='flex justify-between'>
            <span className='font-medium'>ID:</span>
            <span>{data.id}</span>
          </div>
          <div className='flex justify-between'>
            <span className='font-medium'>Gender:</span>
            <span>{data.gender}</span>
          </div>
          <div className='flex justify-between'>
            <span className='font-medium'>Class:</span>
            <span>{data.cattleClass}</span>
          </div>
          <div className='flex justify-between'>
            <span className='font-medium'>Created At:</span>
            <span>{data.createdAt.toDateString()}</span>
          </div>
          <div className='flex justify-between'>
            <span className='font-medium'>Last Updated:</span>
            <span>{data.updatedAt.toDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
