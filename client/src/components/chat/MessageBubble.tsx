import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '../ui/Avatar';

interface MessageUser {
  _id: string;
  name: string;
  avatar: string | null;
}

interface Message {
  _id: string;
  sender: MessageUser;
  receiver: MessageUser;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageBubble = ({ message, isOwnMessage }: ChatMessageProps) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isOwnMessage && (
        <Avatar
          src={message.sender.avatar}
          alt={message.sender.name}
          size="sm"
          className="mr-2 self-end flex-shrink-0"
        />
      )}

      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div
          className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
            isOwnMessage
              ? 'bg-primary-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </span>
      </div>

      {isOwnMessage && (
        <Avatar
          src={message.sender.avatar}
          alt={message.sender.name}
          size="sm"
          className="ml-2 self-end flex-shrink-0"
        />
      )}
    </div>
  );
};