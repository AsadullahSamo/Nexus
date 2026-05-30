import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, MessageCircle, DollarSign, Clock } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useMeetings } from '../../hooks/useMeetings';
import { useConversations } from '../../hooks/useMessages';
import { useDocuments } from '../../hooks/useDocuments';
import { useBalance } from '../../hooks/useTransactions';
import { format } from 'date-fns';
import { Meeting } from '../../types/index';

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: meetings = [] } = useMeetings();
  const { data: conversations = [] } = useConversations();
  const { data: documents = [] } = useDocuments(user?._id);
  const { data: balance = 0 } = useBalance();

  if (!user) return null;

  const upcomingMeetings = meetings
    .filter((m: Meeting) => m.status === 'accepted' && new Date(m.scheduledAt) > new Date())
    .sort((a: Meeting, b: Meeting) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const pendingMeetings = meetings.filter((m: Meeting) => m.status === 'pending');
  const unreadConversations = conversations.filter((c: any) => !c.isRead && c.receiver?._id === user._id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
        <p className="text-gray-600">Here's a summary of your activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/meetings">
          <Card className="h-full bg-primary-50 border border-primary-100 hover:shadow-md transition-shadow">
            <CardBody>
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-full mr-4">
                  <Calendar size={20} className="text-primary-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-700">Upcoming Meetings</p>
                  <h3 className="text-xl font-semibold text-primary-900">{upcomingMeetings.length}</h3>
                  {pendingMeetings.length > 0 && (
                    <p className="text-xs text-primary-600">{pendingMeetings.length} pending</p>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </Link>

        <Link to="/messages">
          <Card className="h-full bg-secondary-50 border border-secondary-100 hover:shadow-md transition-shadow">
            <CardBody>
              <div className="flex items-center">
                <div className="p-3 bg-secondary-100 rounded-full mr-4">
                  <MessageCircle size={20} className="text-secondary-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-700">Conversations</p>
                  <h3 className="text-xl font-semibold text-secondary-900">{conversations.length}</h3>
                  {unreadConversations.length > 0 && (
                    <p className="text-xs text-secondary-600">{unreadConversations.length} unread</p>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </Link>

        <Link to="/documents">
          <Card className="h-full bg-accent-50 border border-accent-100 hover:shadow-md transition-shadow">
            <CardBody>
              <div className="flex items-center">
                <div className="p-3 bg-accent-100 rounded-full mr-4">
                  <FileText size={20} className="text-accent-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-accent-700">Documents</p>
                  <h3 className="text-xl font-semibold text-accent-900">{documents.length}</h3>
                </div>
              </div>
            </CardBody>
          </Card>
        </Link>

        <Link to="/payments">
          <Card className="h-full bg-success-50 border border-success-100 hover:shadow-md transition-shadow">
            <CardBody>
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <DollarSign size={20} className="text-success-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-success-700">Balance</p>
                  <h3 className="text-xl font-semibold text-success-900">${balance.toFixed(2)}</h3>
                </div>
              </div>
            </CardBody>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Meetings</h2>
            <Link to="/meetings" className="text-sm font-medium text-primary-600 hover:text-primary-500">View all</Link>
          </CardHeader>
          <CardBody>
            {upcomingMeetings.length > 0 ? (
              <div className="space-y-3">
                {upcomingMeetings.slice(0, 4).map((meeting: Meeting) => {
                  const other = meeting.organizer._id === user._id ? meeting.participant : meeting.organizer;
                  return (
                    <div key={meeting._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{meeting.title}</p>
                        <p className="text-xs text-gray-500">with {other.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-700">{format(new Date(meeting.scheduledAt), 'MMM d')}</p>
                        <p className="text-xs text-gray-500">{format(new Date(meeting.scheduledAt), 'h:mm a')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock size={24} className="text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No upcoming meetings</p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Conversations</h2>
            <Link to="/messages" className="text-sm font-medium text-primary-600 hover:text-primary-500">View all</Link>
          </CardHeader>
          <CardBody>
            {conversations.length > 0 ? (
              <div className="space-y-3">
                {conversations.slice(0, 4).map((conversation: any) => {
                  const isCurrentUserSender = conversation.sender._id === user._id;
                  const other = isCurrentUserSender ? conversation.receiver : conversation.sender;
                  return (
                    <Link key={conversation._id} to={`/chat/${other._id}`}>
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{other.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[180px]">
                              {isCurrentUserSender ? 'You: ' : ''}{conversation.content}
                            </p>
                          </div>
                        </div>
                        {!conversation.isRead && !isCurrentUserSender && (
                          <Badge variant="primary" size="sm" rounded>New</Badge>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <MessageCircle size={24} className="text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No conversations yet</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};