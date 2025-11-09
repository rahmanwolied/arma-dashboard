import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '@/features/customers/actions';

export default function useCustomersQuery() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers(),
    enabled: true
  });
}
