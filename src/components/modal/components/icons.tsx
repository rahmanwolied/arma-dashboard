import {
  Baby,
  CircleOff,
  HeartPulse,
  Milk,
  ShieldAlert,
  Skull,
  Syringe,
  Thermometer,
  XCircle
} from 'lucide-react';

export const StatusIcon: React.FC<{ condition: boolean; type: string }> = ({
  condition,
  type
}) => {
  const icons = {
    quarantined: condition ? (
      <ShieldAlert className='h-5 w-5 text-yellow-500' />
    ) : (
      <CircleOff className='h-5 w-5 text-gray-500' />
    ),
    pregnant: condition ? (
      <Baby className='h-5 w-5 text-pink-500' />
    ) : (
      <CircleOff className='h-5 w-5 text-gray-500' />
    ),
    lactating: condition ? (
      <Milk className='h-5 w-5 text-blue-500' />
    ) : (
      <CircleOff className='h-5 w-5 text-gray-500' />
    ),
    inseminated: condition ? (
      <Syringe className='h-5 w-5 text-purple-500' />
    ) : (
      <CircleOff className='h-5 w-5 text-gray-500' />
    ),
    vaccinated: condition ? (
      <Syringe className='h-5 w-5 text-green-500' />
    ) : (
      <XCircle className='h-5 w-5 text-red-500' />
    )
  };
  return icons[type as keyof typeof icons] || null;
};

export const HealthStatusIcon: React.FC<{
  status: 'HEALTHY' | 'SICK' | 'DEAD';
}> = ({ status }) => {
  const icons = {
    HEALTHY: <HeartPulse className='h-5 w-5 text-green-500' />,
    SICK: <Thermometer className='h-5 w-5 text-red-500' />,
    DEAD: <Skull className='h-5 w-5 text-gray-500' />
  };
  return icons[status] || null;
};
