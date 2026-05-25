import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const fetchDocuments = async () => {
  const res = await api.get('/documents');
  return res.data.documents;
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

export const useDocuments = () =>
  useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
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