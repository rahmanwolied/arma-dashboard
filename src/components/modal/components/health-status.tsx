import type {
  Cattle,
  HealthStatus as HealthStatusEnum
} from '@/prisma/generated/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { HealthStatusIcon, StatusIcon } from './icons';

interface HealthStatusProps {
  data: Pick<
    Cattle,
    | 'isQuarantined'
    | 'isPregnant'
    | 'isLactating'
    | 'isInseminated'
    | 'isVaccinated'
    | 'healthStatus'
    | 'healthNotes'
  >;
}

const StatusIndicator: React.FC<{
  label: string;
  condition: boolean;
  type: string;
}> = ({ label, condition, type }) => (
  <div className='flex items-center gap-2'>
    <span className='font-medium'>{label}:</span>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <StatusIcon condition={condition} type={type} />
          </div>
        </TooltipTrigger>
        <TooltipContent>{condition ? 'Yes' : 'No'}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

export const HealthStatus: React.FC<HealthStatusProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health & Status</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <div className='grid grid-cols-2 gap-4 text-sm sm:grid-cols-3'>
          <StatusIndicator
            label='Quarantined'
            condition={data.isQuarantined}
            type='quarantined'
          />
          <StatusIndicator
            label='Pregnant'
            condition={data.isPregnant}
            type='pregnant'
          />
          <StatusIndicator
            label='Lactating'
            condition={data.isLactating}
            type='lactating'
          />
          <StatusIndicator
            label='Inseminated'
            condition={data.isInseminated}
            type='inseminated'
          />
          <StatusIndicator
            label='Vaccinated'
            condition={data.isVaccinated}
            type='vaccinated'
          />
        </div>
        <Separator />
        <div className='grid gap-2 text-sm'>
          <div className='flex items-center gap-2'>
            <span className='font-medium'>Health Status:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <HealthStatusIcon
                      status={data.healthStatus as HealthStatusEnum}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>{data.healthStatus}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div>
            <span className='font-medium'>Health Notes:</span>
            <p className='text-muted-foreground mt-1'>
              {data.healthNotes || 'No notes.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
