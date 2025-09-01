'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';

import { useDataTable } from '@/hooks/use-data-table';

import type { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import type { FlattenedCattle } from '../../actions';
import { Button } from '@/components/ui/button';
import { IconDownload } from '@tabler/icons-react';
import { useDownload } from '@/hooks/use-download';
import { Loader } from 'lucide-react';

interface CattleTableParams {
  data: FlattenedCattle[];
  totalItems: number;
  columns: ColumnDef<FlattenedCattle>[];
}

export function CattleTable({ data, totalItems, columns }: CattleTableParams) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data, // cattle data
    columns, // cattle columns
    pageCount: pageCount,
    shallow: false, //Setting to false triggers a network request with the updated querystring.
    debounceMs: 500
  });

  const { downloadCattleCSV, isDownloading } = useDownload();

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Button
          variant='outline'
          size='sm'
          onClick={downloadCattleCSV}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader className='animate-spin' />
          ) : (
            <IconDownload />
          )}
          Download
        </Button>
      </DataTableToolbar>
    </DataTable>
  );
}
