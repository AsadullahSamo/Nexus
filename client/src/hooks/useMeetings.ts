import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const fetchMeetings = async () => {
  const res = await api.get('/meetings');
  return res.data.meetings;
};

const scheduleMeeting = async (data: {
  title: string;
  description: string;
  participantId: string;
  scheduledAt: string;
  duration: number;
}) => {
  const res = await api.post('/meetings', data);
  return res.data.meeting;
};

const updateMeetingStatus = async ({
  id,
  status,
}: {
  id: string;
  status: 'accepted' | 'rejected' | 'cancelled';
}) => {
  const res = await api.patch(`/meetings/${id}`, { status });
  return res.data.meeting;
};

const deleteMeeting = async (id: string) => {
  await api.delete(`/meetings/${id}`);
}

export const useMeetings = () =>
  useQuery({
    queryKey: ['meetings'],
    queryFn: fetchMeetings,
  });

export const useScheduleMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scheduleMeeting,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meetings'] }),
  });
};

export const useUpdateMeetingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMeetingStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meetings'] }),
  });
};

export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMeeting,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meetings'] }),
  });
};
