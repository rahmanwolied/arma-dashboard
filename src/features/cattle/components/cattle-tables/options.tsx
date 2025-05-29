import { Cattle } from '@/prisma/generated/prisma';

export const CATTLE_CLASS_OPTIONS = [
  { value: 'GOLD', label: 'Gold' },
  { value: 'SILVER', label: 'Silver' },
  { value: 'PLATINUM', label: 'Platinum' }
];

export const HEALTH_STATUS_OPTIONS = [
  { value: 'isVaccinated' as keyof Cattle, label: 'Vaccinated' },
  { value: 'isPregnant' as keyof Cattle, label: 'Pregnant' },
  { value: 'isLactating' as keyof Cattle, label: 'Lactating' },
  { value: 'isSold' as keyof Cattle, label: 'Sold' },
  { value: 'isQuarantined' as keyof Cattle, label: 'Quarantined' },
  { value: 'DEAD', label: 'Dead' },
  { value: 'HEALTHY', label: 'Healthy' },
  { value: 'SICK', label: 'Sick' }
];
