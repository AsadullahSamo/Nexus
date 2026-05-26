import { useState } from 'react';
import { Calendar, Clock, Plus, Check, X, Ban, Trash2, ChevronDown, Video } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useCall } from '../../context/CallContext';
import { useDeleteMeeting, useMeetings, useScheduleMeeting, useUpdateMeetingStatus } from '../../hooks/useMeetings';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Meeting } from '../../types';
import api from '../../lib/api';
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface UserResult {
  _id: string;
  name: string;
  avatar: string | null;
  role: string;
}

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Meeting;
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { 'en-US': enUS },
});

const statusVariant: Record<Meeting['status'], 'primary' | 'success' | 'error' | 'gray'> = {
  pending: 'primary',
  accepted: 'success',
  rejected: 'error',
  cancelled: 'gray',
};

const searchUsers = async (q: string): Promise<UserResult[]> => {
  if (q.trim().length < 2) return [];
  const res = await api.get(`/users?q=${q}`);
  return res.data.users;
};

const ScheduleMeetingForm = ({ onClose }: { onClose: () => void }) => {
  const { mutate: scheduleMeeting, isPending, error } = useScheduleMeeting();
  const [form, setForm] = useState({
    title: '',
    description: '',
    participantId: '',
    scheduledAt: '',
    duration: 30,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);

  const { data: searchResults = [] } = useQuery({
    queryKey: ['userSearch', searchQuery],
    queryFn: () => searchUsers(searchQuery),
    enabled: searchQuery.trim().length >= 2,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectUser = (u: UserResult) => {
    setSelectedUser(u);
    setForm((prev) => ({ ...prev, participantId: u._id }));
    setSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleMeeting(
      { ...form, duration: Number(form.duration) },
      { onSuccess: onClose }
    );
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-medium text-gray-900">Schedule a Meeting</h2>
      </CardHeader>
      <CardBody>
        {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
                {(error as any)?.response?.data?.message || 'Failed to schedule meeting'}
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Participant</label>
            {selectedUser ? (
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
                <div className="flex items-center gap-3">
                  <Avatar src={selectedUser.avatar} alt={selectedUser.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedUser.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{selectedUser.role}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-xs text-primary-600 hover:text-primary-500"
                  onClick={() => {
                    setSelectedUser(null);
                    setForm((prev) => ({ ...prev, participantId: '' }));
                  }}
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                />
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    {searchResults.map((u: UserResult) => (
                      <button
                        key={u._id}
                        type="button"
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left"
                        onClick={() => handleSelectUser(u)}
                      >
                        <Avatar src={u.avatar} alt={u.name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{u.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                  <p className="mt-1 text-xs text-gray-500">No users found</p>
                )}
              </>
            )}
          </div>

          <Input
            label="Date & Time"
            name="scheduledAt"
            type="datetime-local"
            value={form.scheduledAt}
            onChange={handleChange}
            required
            fullWidth
          />

          <Input
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={String(form.duration)}
            onChange={handleChange}
            required
            fullWidth
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isPending} disabled={!form.participantId}>
              Schedule
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};


const MeetingCard = ({ meeting, userId, onUpdateStatus }: {
  meeting: Meeting;
  userId: string;
  onUpdateStatus: (id: string, status: 'accepted' | 'rejected' | 'cancelled') => void;
}) => {
  const isOrganizer = (meeting.organizer as any)._id === userId;
  const other = isOrganizer ? meeting.participant : meeting.organizer;

  const { initiateCall } = useCall();

  return (
    <div className="flex items-start justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-start gap-4">
        <Avatar src={(other as any).avatar} alt={(other as any).name} size="md" />
        <div>
          <h3 className="text-sm font-medium text-gray-900">{meeting.title}</h3>
          <p className="text-sm text-gray-500">{(other as any).name}</p>
          {meeting.description && (
            <p className="text-xs text-gray-400 mt-0.5">{meeting.description}</p>
          )}
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(meeting.scheduledAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {new Date(meeting.scheduledAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {' · '}{meeting.duration} min
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
        <Badge variant={statusVariant[meeting.status]}>{meeting.status}</Badge>
        {meeting.status === 'pending' && !isOrganizer && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateStatus(meeting._id, 'accepted')}
            >
              <Check size={14} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateStatus(meeting._id, 'rejected')}
            >
              <X size={14} />
            </Button>
          </>
        )}
       {(meeting.status === 'pending' && isOrganizer) || meeting.status === 'accepted' ? (
        <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateStatus(meeting._id, 'cancelled')}
        >
            <Ban size={14} />
        </Button>
        ) : null}

        {meeting.status === 'accepted' && (
          <button
            onClick={() =>
              initiateCall(
                (other as any)._id,
                {
                  _id: (other as any)._id,
                  name: (other as any).name,
                  avatar: (other as any).avatar,
                }
              )
            }
            className="p-2 rounded-full bg-primary-600 hover:bg-primary-700 transition-colors"
            title="Start video call"
          >
            <Video size={16} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
};


{/* cancelled and rejected meetings */}
const DismissedMeetings = ({ meetings, userId, onUpdateStatus }: {
  meetings: Meeting[];
  userId: string;
  onUpdateStatus: (id: string, status: 'accepted' | 'rejected' | 'cancelled') => void;
}) => { 

  const [show, setShow] = useState(false);
  const {mutate: deleteMeeting} = useDeleteMeeting();

  if (meetings.length === 0) return null;

  return (
      <div>
        <button
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
          onClick={() => setShow((prev) => !prev)}
        >
          <ChevronDown size={14} className={`transition-transform ${show ? 'rotate-180' : ''}`} />
          {show ? 'Hide' : 'Show'} cancelled & rejected ({meetings.length})
        </button>
        {show && (
          <Card className="mt-3">
            <CardBody className="divide-y divide-gray-100">
              {meetings.map((m) => (
                <div key={m._id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <MeetingCard
                      meeting={m}
                      userId={userId}
                      onUpdateStatus={onUpdateStatus}
                    />
                  </div>
                  <button
                    className="ml-2 p-1.5 text-gray-400 hover:text-error-600 transition-colors flex-shrink-0"
                    onClick={() => deleteMeeting(m._id)}
                    title="Delete permanently"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </CardBody>
          </Card>
        )}
      </div>
    );
};

export const MeetingsPage = () => {
  const { user } = useAuth();
  const { data: meetings = [], isLoading } = useMeetings();
  const { mutate: updateStatus } = useUpdateMeetingStatus();
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [calendarView, setCalendarView] = useState<View>('month');

  if (!user) return null;

  const now = new Date();

  const pending = meetings.filter((m: Meeting) => m.status === 'pending');
  const upcoming = meetings.filter(
    (m: Meeting) => m.status === 'accepted' && new Date(m.scheduledAt) > now
  );
  const past = meetings.filter(
    (m: Meeting) => m.status === 'accepted' && new Date(m.scheduledAt) <= now
  );

  const handleUpdateStatus = (id: string, status: 'accepted' | 'rejected' | 'cancelled') => {
    updateStatus({ id, status });
  };

  const calendarEvents: CalendarEvent[] = meetings.filter((m: Meeting) => m.status === 'accepted')
  .map((m: Meeting) => {
    const isOrganizer = (m.organizer as any)._id === user._id;
    const other = isOrganizer ? m.participant : m.organizer;
    return {
      id: m._id,
      title: `${m.title} — ${(other as any).name}`,
      start: new Date(m.scheduledAt),
      end: new Date(new Date(m.scheduledAt).getTime() + m.duration * 60000),
      resource: m,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600">Schedule and manage your meetings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-md border border-gray-200 overflow-hidden">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-sm transition-colors ${
                view === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-1.5 text-sm transition-colors ${
                view === 'calendar'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Calendar
            </button>
          </div>
          <Button leftIcon={<Plus size={18} />} onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? 'Cancel' : 'Schedule Meeting'}
          </Button>
        </div>
      </div>

      {showForm && <ScheduleMeetingForm onClose={() => setShowForm(false)} />}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600" />
        </div>
      ) : view === 'calendar' ? (
        <Card>
          <CardBody>
            <div style={{ height: 600 }}>
              <BigCalendar
                localizer={localizer}
                events={calendarEvents}
                view={calendarView}
                onView={setCalendarView}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                eventPropGetter={() => ({
                  style: {
                    backgroundColor: '#1D4ED8',
                    borderRadius: '4px',
                    border: 'none',
                    color: 'white',
                    fontSize: '12px',
                  },
                })}
                onSelectEvent={(event) => {
                  const meeting = event.resource as Meeting;
                  const isOrganizer = (meeting.organizer as any)._id === user._id;
                  const other = isOrganizer ? meeting.participant : meeting.organizer;
                  alert(
                    `${meeting.title}\nWith: ${(other as any).name}\n${new Date(meeting.scheduledAt).toLocaleString()}\nDuration: ${meeting.duration} min`
                  );
                }}
              />
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Pending Requests</h2>
              </CardHeader>
              <CardBody className="divide-y divide-gray-100">
                {pending.map((m: Meeting) => (
                  <MeetingCard
                    key={m._id}
                    meeting={m}
                    userId={user._id}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Upcoming Meetings</h2>
            </CardHeader>
            <CardBody className="divide-y divide-gray-100">
              {upcoming.length > 0 ? (
                upcoming.map((m: Meeting) => (
                  <MeetingCard
                    key={m._id}
                    meeting={m}
                    userId={user._id}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 py-4">No upcoming meetings</p>
              )}
            </CardBody>
          </Card>

          {past.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Past Meetings</h2>
              </CardHeader>
              <CardBody className="divide-y divide-gray-100">
                {past.map((m: Meeting) => (
                  <MeetingCard
                    key={m._id}
                    meeting={m}
                    userId={user._id}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </CardBody>
            </Card>
          )}

          <DismissedMeetings
            meetings={meetings.filter((m: Meeting) => m.status === 'rejected' || m.status === 'cancelled')}
            userId={user._id}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      )}
    </div>
  );
};