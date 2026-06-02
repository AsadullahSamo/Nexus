import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Deal } from '../types';

const QUERY_KEY = ['deals'];

export const useDeals = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<Deal[]> => {
      const res = await api.get('/deals');
      return res.data.deals;
    },
  });

export const useCreateDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      entrepreneurId: string;
      amount: string;
      equity: string;
      stage: string;
      notes?: string;
    }) => api.post('/deals', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Deal> }) =>
      api.patch(`/deals/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/deals/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};