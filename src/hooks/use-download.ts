'use client';
import { parseAsString, useQueryState } from 'nuqs';
import { downloadCattleData } from '@/features/cattle/actions'; // Import the server action
import { downloadCattleCSV as _downloadCattleCSV } from '@/lib/download-csv';
import { useState } from 'react';
import { toast } from 'sonner';

export const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const [search] = useQueryState('name', parseAsString.withDefault(''));
  const [sort] = useQueryState('sort', parseAsString.withDefault(''));
  const [healthStatus] = useQueryState(
    'healthStatus',
    parseAsString.withDefault('')
  );
  const [purchasePricePerKg] = useQueryState(
    'purchasePricePerKg',
    parseAsString.withDefault('')
  );
  const [fatPercentage] = useQueryState(
    'fatPercentage',
    parseAsString.withDefault('')
  );
  const [cattleClass] = useQueryState(
    'cattleClass',
    parseAsString.withDefault('')
  );
  const [cattleNumber] = useQueryState(
    'cattleNumber',
    parseAsString.withDefault('')
  );
  const [purchaseDate] = useQueryState(
    'purchaseDate',
    parseAsString.withDefault('')
  );
  const [purchasePrice] = useQueryState(
    'purchasePrice',
    parseAsString.withDefault('')
  );

  const downloadCattleCSV = async () => {
    setIsDownloading(true);
    try {
      const filters = {
        search,
        sort,
        healthStatus,
        purchasePricePerKg,
        fatPercentage,
        cattleClass,
        cattleNumber,
        purchaseDate,
        purchasePrice
      };

      const cattle = await downloadCattleData(filters);

      console.log('cattle', cattle);

      _downloadCattleCSV(cattle, 'cattle-data.csv');
    } catch (error) {
      toast.error('Error downloading cattle data');
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadCattleCSV, isDownloading };
};
