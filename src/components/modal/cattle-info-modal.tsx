'use client';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { FlattenedCattle } from '@/features/cattle/actions';
import { GeneralInfo } from './components/general-info';
import { HealthStatus } from './components/health-status';
import { PurchaseDetails } from './components/purchase-details';
import { SaleDetails } from './components/sale-details';
import { SlaughterInfo } from './components/slaughter-info';

interface CattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FlattenedCattle;
}

export const CattleInfoModal: React.FC<CattleModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <VisuallyHidden asChild>
        <SheetTitle>Cattle Info</SheetTitle>
      </VisuallyHidden>
      <SheetContent className='w-full overflow-y-auto sm:max-w-2xl'>
        <SheetHeader>
          <SheetTitle>
            Cattle Details: {data.name} ({data.cattleNumber})
          </SheetTitle>
          <SheetDescription>
            Comprehensive information about this cattle.
          </SheetDescription>
        </SheetHeader>
        <div className='grid gap-6 px-6 py-6'>
          <GeneralInfo data={data} />
          <HealthStatus data={data} />
          <PurchaseDetails data={data} />
          <SlaughterInfo data={data} />
          {data.saleDate && <SaleDetails data={data} />}
        </div>
      </SheetContent>
    </Sheet>
  );
};
