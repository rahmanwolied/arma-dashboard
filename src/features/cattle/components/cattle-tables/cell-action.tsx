'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { CattleInfoModal } from '@/components/modal/cattle-info-modal';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { IconEye, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import type { FlattenedCattle } from '@/features/cattle/actions';
import { deleteCattle } from '@/features/cattle/actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CellActionProps {
  data: FlattenedCattle;
}

export function useDeleteCattle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteCattle(id);
    },
    onSuccess: () => {
      // Invalidate or refetch the cattle list query to update UI
      queryClient.invalidateQueries({ queryKey: ['cattle'] });
    },
    onError: (error) => {
      toast.error((error as Error).message);
    }
  });
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [cattleDetailsViewOpen, setCattleDetailsViewOpen] = useState(false);
  const { mutate: deleteCattleMutation, isPending } = useDeleteCattle();

  const onConfirm = () => deleteCattleMutation(data.id);

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onConfirm}
        loading={isPending}
      />
      <CattleInfoModal
        isOpen={cattleDetailsViewOpen}
        onClose={() => setCattleDetailsViewOpen(false)}
        data={data}
      />
      <div className='flex gap-2'>
        <ViewButton setOpen={setCattleDetailsViewOpen} />
        <DeleteButton setOpen={setAlertOpen} />
      </div>
    </>
  );
};

function ViewButton({ setOpen }: { setOpen: (open: boolean) => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='ghost' onClick={() => setOpen(true)}>
          <IconEye />
        </Button>
      </TooltipTrigger>
      <TooltipContent>View</TooltipContent>
    </Tooltip>
  );
}

function DeleteButton({ setOpen }: { setOpen: (open: boolean) => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='ghost' onClick={() => setOpen(true)}>
          <IconTrash />
        </Button>
      </TooltipTrigger>
      <TooltipContent
        arrowClassName='fill-destructive bg-destructive'
        className='bg-destructive text-white'
      >
        Delete
      </TooltipContent>
    </Tooltip>
  );
}
