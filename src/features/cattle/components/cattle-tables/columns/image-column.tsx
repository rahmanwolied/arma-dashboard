'use client';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import type { Cattle } from '@/prisma/generated/prisma';

export const imageColumn: ColumnDef<Cattle> = {
  accessorKey: 'imageUrl',
  header: 'IMAGE',
  cell: ({ row }) => {
    return (
      <Image
        src={row.getValue('imageUrl') || '/assets/cow.png'}
        alt={row.original.cattleNumber.toString()}
        width={75}
        height={75}
        className='aspect-square rounded-lg object-cover'
      />
    );
  },
  enableColumnFilter: true,
  enableHiding: true,
  meta: {
    label: 'Image'
  }
};
