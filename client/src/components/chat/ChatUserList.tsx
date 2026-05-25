import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { useConversations } from '../../hooks/useMessages';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

export const ChatUserList = () => {
  const navigate = useNavigate();
  const { userId: activeUserId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const { data: conversations = [], isLoading } = useConversations();

  if (!currentUser) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="bg-white border-r border-gray-200 w-full md:w-64 overflow-y-auto">
      <div className="py-4">
        <h2 className="px-4 text-lg font-semibold text-gray-800 mb-4">Messages</h2>
        <div className="space-y-1">
          {conversations.length > 0 ? (
            conversations.map((conversation: any) => {
              
              const isCurrentUserSender = conversation.sender._id === currentUser._id;
              const other = isCurrentUserSender ? conversation.receiver : conversation.sender;
              const isActive = activeUserId === other._id;

              return (
                <div
                  key={conversation._id}
                  onClick={() => navigate(`/chat/${other._id}`)}
                  className={`px-4 py-3 flex cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 border-l-4 border-primary-600'
                      : 'hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <Avatar
                    src={other.avatar}
                    alt={other.name}
                    size="md"
                    className="mr-3 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {other.name}
                      </h3>
                      <span className="text-xs text-gray-500 ml-1 flex-shrink-0">
                        {formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: false })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-600 truncate">
                        {isCurrentUserSender ? 'You: ' : ''}{conversation.content}
                      </p>
                      {!conversation.isRead && !isCurrentUserSender && (
                        <Badge variant="primary" size="sm" rounded>New</Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500">No conversations yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};