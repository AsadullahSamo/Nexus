import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { EntrepreneurProfile, InvestorProfile } from '../types';

export const useEntrepreneurProfile = (userId: string) =>
  useQuery({
    queryKey: ['entrepreneur-profile', userId],
    queryFn: async (): Promise<EntrepreneurProfile> => {
      const res = await api.get(`/profiles/entrepreneur/${userId}`);
      return res.data.profile;
    },
    enabled: !!userId,
  });

export const useUpdateEntrepreneurProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<EntrepreneurProfile> }) =>
      api.patch(`/profiles/entrepreneur/${userId}`, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['entrepreneur-profile', userId] });
    },
  });
};

export const useInvestorProfile = (userId: string) =>
  useQuery({
    queryKey: ['investor-profile', userId],
    queryFn: async (): Promise<InvestorProfile> => {
      const res = await api.get(`/profiles/investor/${userId}`);
      return res.data.profile;
    },
    enabled: !!userId,
  });

export const useUpdateInvestorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<InvestorProfile> }) =>
      api.patch(`/profiles/investor/${userId}`, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['investor-profile', userId] });
    },
  });
};