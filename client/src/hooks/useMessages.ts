import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const fetchConversations = async () => {
  const res = await api.get('/messages/conversations');
  return res.data.conversations;
};

const fetchMessages = async (userId: string) => {
  const res = await api.get(`/messages/${userId}`);
  return res.data.messages;
};

const postMessage = async ({ userId, content }: { userId: string; content: string }) => {
  const res = await api.post(`/messages/${userId}`, { content });
  return res.data.message;
};

export const useConversations = () =>
  useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
  });

export const useMessages = (userId: string) =>
  useQuery({
    queryKey: ['messages', userId],
    queryFn: () => fetchMessages(userId),
    enabled: !!userId,
  });

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postMessage,
    onSuccess: (newMessage) => {
      const receiverId = newMessage.receiver._id;
      const senderId = newMessage.sender._id;

      queryClient.setQueryData(
        ['messages', receiverId],
        (old: any[] = []) => [...old, newMessage]
      );
      queryClient.setQueryData(
        ['messages', senderId],
        (old: any[] = []) => [...old, newMessage]
      );
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};