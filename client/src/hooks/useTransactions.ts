import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Transaction } from '../types';

const TRANSACTIONS_KEY = ['transactions'];

const fetchHistory = async (): Promise<Transaction[]> => {
  const res = await api.get('/transactions/history');
  return res.data.transactions;
};

export const useTransactions = () => {
  return useQuery({
    queryKey: TRANSACTIONS_KEY,
    queryFn: fetchHistory
  });
};

export const useBalance = () =>
  useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const res = await api.get('/transactions/balance');
      return res.data.balance as number;
    },
});

export const useDeposit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => api.post('/transactions/deposit', { amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
};

export const useWithdraw = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => api.post('/transactions/withdraw', { amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
};

export const useTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount: number; toUserId: string }) =>
      api.post('/transactions/transfer', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
};

