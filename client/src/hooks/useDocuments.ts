import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const fetchDocuments = async () => {
  const res = await api.get('/documents');
  return res.data;
};

const uploadDocument = async (formData: FormData) => {
  const res = await api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.document;
};

const deleteDocument = async (id: string) => {
  await api.delete(`/documents/${id}`);
};

const saveSignature = async ({ id, signature }: { id: string; signature: string }) => {
  const res = await api.patch(`/documents/${id}/signature`, { signature });
  return res.data.document;
};

export const useDocuments = (userId: string | undefined) =>
  useQuery({
    queryKey: ['documents', userId],
    queryFn: fetchDocuments,
    enabled: !!userId,
  });

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
};

export const useSaveSignature = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSignature,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
};

export const useShareDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      api.patch(`/documents/${id}/share`, { userId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
};

export const useUnshareDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      api.delete(`/documents/${id}/share/${userId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
};