import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const fetchUser = async (id: string) => {
  const res = await api.get(`/users/${id}`);
  return res.data.user;
};

const updateUser = async ({ id, data }: { id: string; data: Record<string, string> }) => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data.user;
};

export const useProfile = (id: string) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });

export const useUpdateProfile = (onUpdated?: (user: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user', updatedUser._id], updatedUser);
      onUpdated?.(updatedUser);
    },
  });
};