import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, MessageCircle, DollarSign, Check } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNotifications, useMarkRead, useMarkAllRead } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

const getIcon = (type: string) => {
  if (type.startsWith('meeting')) return <Calendar size={16} className="text-primary-600" />;
  if (type === 'new_message') return <MessageCircle size={16} className="text-secondary-600" />;
  if (type === 'transfer_received') return <DollarSign size={16} className="text-success-600" />;
  return <Bell size={16} className="text-gray-600" />;
};

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: notifications = [], isLoading } = useNotifications();
  const { mutate: markRead } = useMarkRead();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllRead();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleClick = (id: string, link: string | null) => {
    markRead(id);
    if (link) navigate(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            isLoading={isMarkingAll}
            leftIcon={<Check size={16} />}
            onClick={() => markAllRead()}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Bell size={24} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-medium text-gray-900">No notifications yet</h2>
          <p className="text-gray-500 mt-1">Activity from meetings, messages and payments will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card
              key={n._id}
              className={`cursor-pointer transition-colors hover:shadow-sm ${!n.isRead ? 'bg-primary-50 border-primary-100' : ''}`}
              onClick={() => handleClick(n._id, n.link)}
            >
              <CardBody className="flex items-start gap-4 p-4">
                <div className="p-2 bg-white rounded-full border border-gray-200 flex-shrink-0">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    {!n.isRead && <Badge variant="primary" size="sm" rounded>New</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{n.body}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};